"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { BlurText } from "@/components/ui/BlurText";
import DarkVeil from "@/components/ui/DarkVeil";
import ProfileCard from "@/components/ui/ProfileCard";
import { cn } from "@/lib/utils";
import { sendGAEvent } from '@next/third-parties/google';

export function Hero() {
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    // Allow BlurText to play (1.2s), hold briefly, then release
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <>
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-background pointer-events-none"
          />
        )}
      </AnimatePresence>

      <section
      id="home"
      className="relative min-h-[100svh] lg:h-screen flex flex-col items-center justify-start lg:justify-center overflow-hidden pt-24 lg:pt-20 pb-36 lg:pb-0"
    >
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-60 dark:opacity-50 transition-all duration-700">
        <DarkVeil 
          hueShift={25} 
          noiseIntensity={0.08} 
          scanlineIntensity={0} 
          speed={0.2} 
          scanlineFrequency={0} 
          warpAmount={0.7} 
        />
      </div>      <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl w-full px-4 gap-8 lg:gap-24 relative">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="mb-4 min-h-[4rem] flex flex-wrap justify-center lg:justify-start gap-x-4 lg:gap-x-6 items-center">
            <motion.div
              layout
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "mix-blend-difference text-neutral-200 relative z-[101]",
                isPreloading 
                  ? "fixed inset-0 flex items-center justify-center gap-4 lg:gap-8 pointer-events-none" 
                  : "flex flex-wrap justify-center lg:justify-start gap-x-4 lg:gap-x-6 items-center pointer-events-auto"
              )}
            >
              <motion.div layout transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <BlurText
                  text="TARUN"
                  delay={0.2}
                  stagger={0.08}
                  animateOnMount={true}
                  splitBy="character"
                  className="text-[2.75rem] md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-tight uppercase"
                />
              </motion.div>
              <motion.div layout transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <BlurText
                  text="ASTHANA"
                  delay={0.6}
                  stagger={0.08}
                  animateOnMount={true}
                  splitBy="character"
                  className="text-[2.75rem] md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-tight uppercase"
                />
              </motion.div>
            </motion.div>
          </div>

          <BlurText
            text="Full Stack Web Developer"
            delay={3.5}
            animateOnMount={true}
            className="mt-6 text-xl md:text-2xl lg:text-3xl font-serif italic text-foreground/80"
          />

          <BlurText
            text="I blend creative UI/UX design with robust engineering to craft responsive, user-friendly, and highly interactive digital experiences."
            delay={3.8}
            stagger={0.05}
            animateOnMount={true}
            className="mt-8 max-w-xl text-muted-foreground text-sm md:text-base leading-relaxed justify-center lg:justify-start text-center lg:text-left"
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={!isPreloading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 4.0, duration: 0.8 }}
            className="mt-10 flex justify-center lg:justify-start w-full"
          >
             <a 
               href="/Tarun_Asthana_Resume.pdf" 
               download="Tarun_Asthana_Resume.pdf" 
               onClick={() => sendGAEvent({ event: 'Resume_Downloaded', value: 'hero_section' })}
               className="glass backdrop-blur-lg px-8 py-3.5 rounded-full flex items-center gap-3 hover:bg-white/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 border border-black/10 dark:border-white/10 shadow-xl group"
             >
                 <Download size={18} className="text-primary group-hover:-translate-y-0.5 transition-transform" />
                 <span className="font-bold tracking-wider text-sm uppercase text-foreground">Download Resume</span>
             </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: "100vh" }}
          animate={!isPreloading ? { y: 0 } : { y: "100vh" }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-sm lg:max-w-md mx-auto lg:mx-0"
        >
          <ProfileCard
            name="Tarun Asthana"
            title="Fullstack Web Developer"
            handle="tarunasthana"
            status="Available for work"
            avatarUrl="/avatar.png"
            contactText="Contact Me"
            viewWorkText="View Work"
            contactHref="#contact"
            viewWorkHref="#projects"
            enableMobileTilt={true}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isPreloading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold opacity-80">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-white/10 relative flex justify-center">
          <motion.div
            animate={{ 
              y: ["-100%", "200%", "200%"],
              opacity: [0, 1, 0, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              times: [0, 0.3, 0.6, 1],
              ease: "easeInOut" 
            }}
            className="absolute top-0 w-[2px] h-1/2 bg-white rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.9)]"
          />
        </div>
      </motion.div>
    </section>
    </>
  );
}
