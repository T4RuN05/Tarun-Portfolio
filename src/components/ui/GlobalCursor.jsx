"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { MessageSquareDashed, Zap } from "lucide-react";

const EASTER_EGG_PHRASES = [
  "so... did I beat the \"another portfolio\" allegations?",
  "chat, did I cook?",
  "am I cooked or cooking?",
  "blink twice if you liked it.",
  "so... hire me maybe?",
  "well? don't leave me hanging",
  "be honest, did I cook?"
];

const SPEED_PHRASES = [
  "bro thinks this is TikTok",
  "ayo slow down",
  "speedrunning my portfolio?",
  "bro skipped the lore.",
  "average reels consumer behavior.",
  "not the TikTok thumb",
  "cooked attention span.",
  "I spent hours on that section btw"
];

const TypewriterText = ({ text }) => {
  return (
    <span className="inline-flex">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.025, ease: "easeOut" }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export function GlobalCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isElevated, setIsElevated] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tracking
  const springX = useSpring(mouseX, { stiffness: 800, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 800, damping: 40 });

  // Scroll velocity tracking
  const velocity = useMotionValue(0);
  const smoothVelocity = useSpring(velocity, { stiffness: 400, damping: 50 });
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  // Easter Egg states: 'contact', 'speed', or null
  const [activePill, setActivePill] = useState(null); 
  const [phrase, setPhrase] = useState("");
  const globalLenis = useLenis();

  // Track page load time
  const loadTimeRef = useRef(0);
  useEffect(() => {
    loadTimeRef.current = Date.now();
  }, []);

  // Handle Custom Speedrun Event from Timeline
  useEffect(() => {
    const handleSpeedrunEvent = () => triggerSpeedrun();
    window.addEventListener('speedrun-detected', handleSpeedrunEvent);
    return () => window.removeEventListener('speedrun-detected', handleSpeedrunEvent);
  }, []);

  const triggerSpeedrun = () => {
    setActivePill((prev) => {
      if (prev !== 'contact' && prev !== 'speed') {
        setPhrase(SPEED_PHRASES[Math.floor(Math.random() * SPEED_PHRASES.length)]);
        return 'speed';
      }
      return prev;
    });
  };

  // react-doctor-disable-next-line
  useEffect(() => {
    // Only enable on desktop
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Hide cursor if hovering over an element that specifically requests it
      if (e.target.closest('[data-hide-cursor="true"]')) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Elevate cursor (scale up to simulate Z-index climb)
      if (e.target.closest('[data-elevate-cursor="true"]')) {
        setIsElevated(true);
      } else {
        setIsElevated(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDesktop, mouseX, mouseY]);

  useEffect(() => {
    if (globalLenis) {
      const handleScroll = (e) => {
        velocity.set(e.velocity);
        
        // Detect if we reached the bottom (Contact section)
        const hitBottom = e.progress > 0.92;
        if (hitBottom && !isAtBottom) {
          setIsAtBottom(true);
          
          // Speedrun check: If they hit the bottom in under 20 seconds from load
          if (loadTimeRef.current > 0 && (Date.now() - loadTimeRef.current) < 20000) {
            triggerSpeedrun();
          }
        } else if (!hitBottom && isAtBottom) {
          setIsAtBottom(false);
        }
      };
      globalLenis.on('scroll', handleScroll);
      return () => globalLenis.off('scroll', handleScroll);
    }
    // react-doctor-disable-next-line
  }, [globalLenis, isAtBottom]);

  // Handle Contact Easter Egg (4-second delay)
  useEffect(() => {
    let timer;
    if (isAtBottom) {
      timer = setTimeout(() => {
        setPhrase(EASTER_EGG_PHRASES[Math.floor(Math.random() * EASTER_EGG_PHRASES.length)]);
        setActivePill('contact');
      }, 4000);
    } else {
      setActivePill((prev) => (prev === 'contact' ? null : prev));
    }
    
    return () => clearTimeout(timer);
  }, [isAtBottom]);

  // Handle Speedrun Easter Egg (disappear after 3 seconds)
  useEffect(() => {
    let timer;
    if (activePill === 'speed') {
      timer = setTimeout(() => {
        setActivePill(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [activePill]);

  // 3D Tilt Logic: Maps mouse position relative to screen center
  const rotateY = useTransform(springX, (x) => {
    if (typeof window === 'undefined') return "0deg";
    const xPct = (x / window.innerWidth) - 0.5;
    return `${xPct * 40}deg`;
  });

  const rotateX = useTransform(springY, (y) => {
    if (typeof window === 'undefined') return "0deg";
    const yPct = (y / window.innerHeight) - 0.5;
    return `${-yPct * 40}deg`;
  });



  if (!isDesktop) return null;

  return (
    <>
      {/* 1. The VFX Cursor (Blended) */}
      <div className="fixed inset-0 pointer-events-none z-[99999] mix-blend-difference">
        <div className="w-full h-full" style={{ perspective: 1000 }}>
          <motion.div
            style={{
              x: springX,
              y: springY,
              rotateX,
              rotateY,
              transformOrigin: "top left",
              translateX: "-4px",
              translateY: "-4px"
            }}
            className="absolute top-0 left-0"
          >
            <motion.div
              animate={{
                opacity: isHidden ? 0 : 1,
                scale: isHidden ? 0.5 : (isClicked ? 0.85 : (isElevated ? 1.35 : 1)),
              }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              >
                <path 
                  d="M5.5 3.5L18.5 10.5L12 12.5L10 19.5L5.5 3.5Z" 
                  fill="currentColor" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. The Easter Egg Pill (Solid) */}
      <div className="fixed inset-0 pointer-events-none z-[99999]">
        <div className="w-full h-full" style={{ perspective: 1000 }}>
          <motion.div
            style={{
              x: springX,
              y: springY,
              rotateX,
              rotateY,
              transformOrigin: "top left",
              translateX: "-4px",
              translateY: "-4px"
            }}
            className="absolute top-0 left-0"
          >
            <AnimatePresence mode="wait">
              {activePill && !isHidden && (
                <motion.div
                  key={phrase}
                  initial={{ opacity: 0, scale: 0.9, x: 30, y: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 30, y: 30 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute top-0 left-0 bg-foreground text-background px-4 py-2.5 rounded-full font-bold tracking-tight text-xs flex items-center gap-2.5 whitespace-nowrap shadow-xl border border-black/10 origin-top-left"
                >
                  {activePill === 'contact' ? (
                    <MessageSquareDashed size={14} className="text-background/60 animate-pulse shrink-0" />
                  ) : (
                    <Zap size={14} className="text-background/60 animate-bounce shrink-0" />
                  )}
                  <TypewriterText text={phrase} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
