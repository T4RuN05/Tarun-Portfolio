"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music, X, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendGAEvent } from '@next/third-parties/google';

const playlist = [
  {
    id: 1,
    title: "the kill",
    artist: "Lex Armani",
    src: "/audio/track1.mp3",
    cover: "/audio-cover/track1.jpg"
  },
  {
    id: 2,
    title: "4 Raws",
    artist: "Esdeekid",
    src: "/audio/track2.mp3",
    cover: "/audio-cover/track2.jpg"
  },
  {
    id: 3,
    title: "Move",
    artist: "keinemusik",
    src: "/audio/track3.mp3",
    cover: "/audio-cover/track3.jpg"
  }
];

const TOOLTIP_PHRASES = [
  "one click won't hurt",
  "press play, I dare you",
  "chat, hear me out...",
  "compiled with beats",
  "npm install good-vibes"
];

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(TOOLTIP_PHRASES[0]);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  
  // Direct DOM refs for glow elements
  const glowARef = useRef(null);
  const glowBRef = useRef(null);
  const collapsedGlowRef = useRef(null);
  
  const smoothedBassRef = useRef(0);
  const smoothedMidRef = useRef(0);
  const rafRef = useRef(null);
  const interactionTimerRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const hasTriggeredAutoFadeRef = useRef(false);
  const pulseScale = useMotionValue(1);
  
  const [isMobilePillVisible, setIsMobilePillVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Auto-collapse mobile pill after 4 seconds
  useEffect(() => {
    let timeout;
    if (!isDesktop && isMobilePillVisible && !isExpanded) {
      timeout = setTimeout(() => {
        setIsMobilePillVisible(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [isMobilePillVisible, isDesktop, isExpanded]);

  const currentTrack = playlist[currentTrackIndex];

  // Smooth Audio Fading Engine
  const fadeAudio = (targetVolume, durationMs = 300, onComplete) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const startVolume = audioRef.current.volume;
    const distance = targetVolume - startVolume;
    
    // If we're already at target volume, resolve instantly
    if (Math.abs(distance) < 0.01) {
       audioRef.current.volume = Math.max(0, Math.min(1, targetVolume));
       if (onComplete) onComplete();
       return;
    }

    const steps = durationMs / 16; // 60fps
    const stepSize = distance / steps;
    
    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current);
        return;
      }
      
      let nextVolume = audioRef.current.volume + stepSize;
      
      if ((stepSize > 0 && nextVolume >= targetVolume) || (stepSize < 0 && nextVolume <= targetVolume)) {
        audioRef.current.volume = Math.max(0, Math.min(1, targetVolume));
        clearInterval(fadeIntervalRef.current);
        if (onComplete) onComplete();
      } else {
        audioRef.current.volume = Math.max(0, Math.min(1, nextVolume));
      }
    }, 16);
  };

  // Reset inactivity timer
  const resetInteractionTimer = () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    if (isExpanded) {
      interactionTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000); // 5 seconds of inactivity closes it
    }
  };

  useEffect(() => {
    resetInteractionTimer();
    return () => {
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    };
  }, [isExpanded, isPlaying]);

  // Set initial volume to 0 immediately on mount to prevent browser play-buffer bursts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
  }, []);

  const initAudio = () => {
    if (!audioRef.current) return;
    
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.3;
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (err) {
        console.error("Web Audio API Init Error:", err);
      }
    }
    
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const togglePlay = () => {
    initAudio();
    if (isPlaying) {
      setIsPlaying(false);
      fadeAudio(0, 300, () => audioRef.current?.pause());
    } else {
      setIsPlaying(true); // Handled by useEffect fade in
    }
  };

  const changeTrack = (newIndex) => {
    if (isPlaying && audioRef.current && audioRef.current.volume > 0.01) {
      fadeAudio(0, 300, () => setCurrentTrackIndex(newIndex));
    } else {
      setCurrentTrackIndex(newIndex);
    }
  };

  const nextTrack = () => changeTrack((currentTrackIndex + 1) % playlist.length);
  const prevTrack = () => changeTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);

  const playTrack = (idx) => {
    if (idx === currentTrackIndex) {
      if (!isPlaying) togglePlay();
      return;
    }
    changeTrack(idx);
    if (!isPlaying) setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      initAudio();
      // Force volume to 0 immediately before requesting play
      audioRef.current.volume = 0; 
      audioRef.current.play().then(() => {
        // Slow, luxurious 1.5s fade in
        fadeAudio(1, 1500);
        sendGAEvent('event', 'Song_Played', { value: currentTrack.title });
      }).catch(e => {
        console.warn("Audio play failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
     hasTriggeredAutoFadeRef.current = false;
  }, [currentTrackIndex]);

  useEffect(() => {
    // Show the tooltip after 15 seconds on every refresh
    setTooltipText(TOOLTIP_PHRASES[Math.floor(Math.random() * TOOLTIP_PHRASES.length)]);
    const timer = setTimeout(() => setShowTooltip(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleExpand = (e) => {
    if (e) e.stopPropagation();
    setIsExpanded(true);
    if (showTooltip) setShowTooltip(false);
    sendGAEvent('event', 'Music_Player_Opened', { value: 'opened' });
  };

  // === THE VISUALIZER ENGINE ===
  useEffect(() => {
    const renderFrame = () => {
      rafRef.current = requestAnimationFrame(renderFrame);
      
      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let bassSum = 0, midSum = 0;
        const bassCount = Math.floor(bufferLength * 0.15);
        const midCount = Math.floor(bufferLength * 0.35);
        
        for (let i = 0; i < bassCount; i++) bassSum += dataArray[i];
        for (let i = bassCount; i < bassCount + midCount; i++) midSum += dataArray[i];
        
        const bassNorm = (bassSum / bassCount) / 255 || 0;
        const midNorm = (midSum / midCount) / 255 || 0;
        
        // Non-linear mapping to increase variance (lows lower, highs higher)
        const linearBass = Math.min(1, Math.max(0, (bassNorm - 0.15) / 0.7));
        const linearMid = Math.min(1, Math.max(0, (midNorm - 0.1) / 0.6));
        
        // Power of 2 curve pushes low/mid values closer to 0, while keeping peaks near 1
        const rawBass = Math.pow(linearBass, 2.0);
        const rawMid = Math.pow(linearMid, 2.0);
        
        // Punchy attack, smooth deep decay
        smoothedBassRef.current += (rawBass - smoothedBassRef.current) * (rawBass > smoothedBassRef.current ? 0.6 : 0.05);
        smoothedMidRef.current += (rawMid - smoothedMidRef.current) * (rawMid > smoothedMidRef.current ? 0.6 : 0.05);
      } else {
        // Decay to zero when paused
        smoothedBassRef.current *= 0.92;
        smoothedMidRef.current *= 0.92;
      }
      
      const bass = smoothedBassRef.current;
      const mid = smoothedMidRef.current;
      
      // Apply to expanded glow A (bass-driven)
      if (glowARef.current) {
        const s = glowARef.current.style;
        s.opacity = `${bass * 1.5}`; // CSS clamps at 1, so peaks stay fully opaque
        s.transform = `scale(${1 + bass * 0.8})`; // Much larger scale variance
        s.filter = `blur(${10 + bass * 60}px) saturate(${1 + bass * 4})`; // Drastic blur and saturation spikes
      }
      
      // Apply to expanded glow B (mid-driven)
      if (glowBRef.current) {
        const s = glowBRef.current.style;
        s.opacity = `${mid * 1.2}`;
        s.transform = `scale(${1 + mid * 0.6})`;
        s.filter = `blur(${15 + mid * 50}px) saturate(${1 + mid * 3})`;
      }
      
      // Apply to collapsed glow
      if (collapsedGlowRef.current) {
        const combined = (bass + mid) / 2;
        const s = collapsedGlowRef.current.style;
        // Lowered reactivity for collapsed view
        s.opacity = `${combined * 0.8}`;
        s.transform = `scale(${1 + combined * 0.3})`;
        s.filter = `blur(${8 + combined * 15}px) saturate(${1 + combined * 1.5})`;
        
        // Noticeable beat pulse to the entire collapsed button
        pulseScale.set(1 + combined * 0.15); 
      }
    };
    
    renderFrame();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      // Fallback: forcefully capture duration if the loadedmetadata event was missed
      setDuration((prev) => {
         const currentDuration = audioRef.current.duration;
         if (currentDuration && currentDuration !== prev && !isNaN(currentDuration) && isFinite(currentDuration)) {
             return currentDuration;
         }
         return prev;
      });

      // Auto crossfade to next track naturally at the end (last 3 seconds)
      if (duration > 0 && duration - current <= 3 && !hasTriggeredAutoFadeRef.current && isPlaying) {
         hasTriggeredAutoFadeRef.current = true;
         fadeAudio(0, 3000, () => nextTrack());
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const currentDuration = audioRef.current.duration;
      if (currentDuration && !isNaN(currentDuration) && isFinite(currentDuration)) {
        setDuration(currentDuration);
      }
    }
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    fadeAudio(0, 200, () => {
       audioRef.current.currentTime = percent * duration;
       setCurrentTime(percent * duration);
       if (isPlaying) fadeAudio(1, 300);
    });
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Shared glow style factory
  const makeGlowStyle = (inset) => ({
    position: 'absolute',
    top: inset, left: inset, right: inset, bottom: inset,
    backgroundImage: `url("${currentTrack.cover}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%',
    opacity: 0,
    pointerEvents: 'none',
    willChange: 'opacity, transform, filter',
  });

  return (
    <>
      {/* NO crossOrigin for local files — it causes frequency data to be all zeros */}
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 left-6 z-[110] flex flex-col items-start gap-4 pointer-events-none"
      >
        
        {/* Tooltip Bubble */}
        <AnimatePresence>
          {showTooltip && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="absolute bottom-full mb-4 left-4 pointer-events-auto origin-bottom-left"
            >
              <div className="relative bg-foreground text-background px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 w-max max-w-[75vw] sm:max-w-none">
                <span className="text-sm font-medium whitespace-normal md:whitespace-nowrap">{tooltipText}</span>
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="p-1 hover:bg-background/20 rounded-full transition-colors opacity-70 hover:opacity-100"
                >
                  <X size={14} />
                </button>
                {/* Speech Tail */}
                <div className="absolute -bottom-1.5 left-6 w-4 h-4 bg-foreground rotate-45 rounded-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onMouseMove={resetInteractionTimer}
              onClick={resetInteractionTimer}
              onTouchStart={resetInteractionTimer}
              onTouchMove={resetInteractionTimer}
              onTouchEnd={resetInteractionTimer}
              className="w-64 md:w-72 pointer-events-auto relative rounded-[1.5rem] shadow-2xl border border-white/10 dark:border-white/5 overflow-hidden"
            >
              {/* GLOW LAYER — z-0, inside the card, clipped by overflow:hidden */}
              <div 
                ref={glowARef}
                className="absolute pointer-events-none"
                style={{
                  top: '-20%', left: '-20%', right: '-20%', bottom: '-20%',
                  backgroundImage: `url("${currentTrack.cover}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '50%',
                  opacity: 0,
                  zIndex: 0,
                  willChange: 'opacity, transform, filter',
                }}
              />
              <div 
                ref={glowBRef}
                className="absolute pointer-events-none"
                style={{
                  top: '-15%', left: '-15%', right: '-15%', bottom: '-15%',
                  backgroundImage: `url("${currentTrack.cover}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '50%',
                  opacity: 0,
                  zIndex: 0,
                  willChange: 'opacity, transform, filter',
                }}
              />

              {/* FROSTED GLASS — z-1, blurs the glow underneath */}
              <div className="absolute inset-0 bg-background/60 dark:bg-background/40 backdrop-blur-[40px] pointer-events-none" style={{ zIndex: 1 }} />

              {/* CONTENT — z-2, on top of everything */}
              <div className="relative p-5 flex flex-col" style={{ zIndex: 2 }}>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Now Playing</span>
                    <button onClick={() => setIsExpanded(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                      <X size={16} />
                    </button>
                  </div>
                  
                  {/* Cover Art */}
                  <div className="relative w-full aspect-square rounded-2xl mb-4 flex items-center justify-center">
                    <div className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden shadow-2xl bg-black">
                      <img 
                        src={currentTrack.cover} 
                        alt="Cover Art" 
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-1000",
                          isPlaying ? "scale-105" : "scale-100"
                        )} 
                      />
                    </div>
                  </div>
              
                  {/* Track Info */}
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-foreground truncate px-2">{currentTrack.title}</h3>
                    <p className="text-xs text-muted-foreground truncate px-2">{currentTrack.artist}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full px-2 mb-4">
                     <div 
                        ref={progressBarRef}
                        onClick={handleProgressClick}
                        className="w-full h-1.5 bg-foreground/10 rounded-full cursor-pointer relative group"
                     >
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary rounded-full"
                          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                        />
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary dark:bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ left: `calc(${(currentTime / duration) * 100 || 0}% - 6px)` }}
                        />
                     </div>
                     <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground font-medium">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                     </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={prevTrack} className="text-foreground hover:text-primary transition-colors">
                      <SkipBack size={20} fill="currentColor" />
                    </button>
                    <button 
                      onClick={togglePlay} 
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition-transform shadow-lg"
                    >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={nextTrack} className="text-foreground hover:text-primary transition-colors">
                      <SkipForward size={20} fill="currentColor" />
                    </button>
                  </div>
                  
                  {/* Mini Playlist */}
                  <div 
                    className="mt-4 pt-3 border-t border-border/50 max-h-24 overflow-y-auto pr-2 scrollbar-thin"
                    data-lenis-prevent="true"
                  >
                    {playlist.map((track, idx) => (
                      <div 
                        key={track.id} 
                        onClick={() => playTrack(idx)}
                        className={cn(
                          "flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-colors",
                          idx === currentTrackIndex ? "bg-primary/10" : "hover:bg-primary/5"
                        )}
                      >
                        <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 bg-black">
                           <img src={track.cover} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className={cn("text-xs truncate font-medium", idx === currentTrackIndex ? "text-primary" : "text-foreground")}>{track.title}</p>
                           <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        {idx === currentTrackIndex && isPlaying && (
                           <div className="flex gap-[2px] items-end h-4 shrink-0">
                              <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-primary rounded-full" />
                              <motion.div animate={{ height: ["8px", "16px", "8px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full" />
                              <motion.div animate={{ height: ["4px", "10px", "4px"] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-primary rounded-full" />
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              style={{ scale: pulseScale, transformOrigin: "left center" }}
              className="pointer-events-auto relative"
            >
              {/* Outer expanding pulse ring on mobile when playing */}
              {isPlaying && !isDesktop && (
                 <div className="absolute top-1/2 left-[28px] -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-primary/40 rounded-full blur-md animate-ping pointer-events-none" style={{ zIndex: -1, animationDuration: '2s' }} />
              )}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  if (!isDesktop && !isMobilePillVisible) {
                    setIsMobilePillVisible(true);
                    resetInteractionTimer();
                  } else {
                    handleExpand(e);
                  }
                }}
                className={cn(
                  "relative rounded-full shadow-xl flex items-center border border-white/10 dark:border-white/5 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  (!isDesktop && !isMobilePillVisible) 
                    ? "w-[56px] h-[56px] justify-center p-0" 
                    : "w-[240px] h-[56px] gap-3 pl-2 pr-4 py-2"
                )}
              >
                {/* Collapsed Glow — z-0, inside button, clipped */}
                <div 
                  ref={collapsedGlowRef}
                  className="absolute pointer-events-none"
                  style={{
                    top: '-50%', left: '-30%', right: '-30%', bottom: '-50%',
                    backgroundImage: `url("${currentTrack.cover}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    opacity: 0,
                    zIndex: 0,
                    willChange: 'opacity, transform, filter',
                  }}
                />

                {/* Frosted Glass — z-1 */}
                <div className="absolute inset-0 bg-background/60 dark:bg-background/40 backdrop-blur-[20px] pointer-events-none rounded-full" style={{ zIndex: 1 }} />

                {/* Content — z-2 */}
                <div className="relative w-10 h-10 shrink-0 group/btn" style={{ zIndex: 2 }}>
                  {isDesktop ? (
                    <>
                      <div className={cn(
                        "absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-tr from-foreground to-foreground/70 text-background shadow-inner transition-opacity duration-300",
                        isPlaying && "animate-spin group-hover/btn:opacity-0"
                      )}>
                        {isPlaying ? <Disc3 size={20} /> : <Music size={20} />}
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                          resetInteractionTimer();
                        }}
                        className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover/btn:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm shadow-xl"
                      >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                      </div>
                    </>
                  ) : (
                    <>
                      {!isMobilePillVisible ? (
                        <div className={cn(
                          "absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-tr from-foreground to-foreground/70 text-background shadow-inner transition-opacity duration-300",
                          isPlaying && "animate-spin"
                        )}>
                          {isPlaying ? <Disc3 size={20} /> : <Music size={20} />}
                        </div>
                      ) : (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                            resetInteractionTimer();
                          }}
                          className="absolute inset-0 rounded-full bg-gradient-to-tr from-foreground to-foreground/70 flex items-center justify-center text-background cursor-pointer shadow-xl"
                        >
                          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className={cn("text-left relative w-[120px]", isDesktop || isMobilePillVisible ? "block" : "hidden")} style={{ zIndex: 2 }}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-[2px]">
                    {isPlaying ? "Now Playing" : (currentTime > 0 ? "Paused" : "Music Player")}
                  </p>
                  <div className="overflow-hidden whitespace-nowrap relative mask-edges" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                    {(currentTime > 0 || isPlaying) ? (
                      <motion.div
                        animate={isPlaying ? { x: ["0%", "-50%"] } : { x: 0 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        className="inline-flex gap-4 text-sm font-medium text-foreground"
                      >
                        <span>{currentTrack.title} • {currentTrack.artist}</span>
                        <span>{currentTrack.title} • {currentTrack.artist}</span>
                      </motion.div>
                    ) : (
                      <p className="text-sm font-medium text-foreground truncate">
                        Click to expand
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
