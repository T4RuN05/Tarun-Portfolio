"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import AsciiBlackHole from "../ui/AsciiBlackHole";
import { LinkPreview } from "../ui/link-preview";

export function Contact() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["64px", "0px"]);

  return (
    <section id="contact" ref={containerRef} className="relative h-[120vh] md:h-[150vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ scale, borderRadius }}
          className="w-full h-full flex flex-col items-center justify-center relative border-t border-black/10 dark:border-white/20 overflow-hidden bg-white dark:bg-[#030303]"
        >
          {/* Interactive ASCII Background (Desktop Only) */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <AsciiBlackHole imageUrl="/Gargantua.jpg" />
          </div>

          {/* Static Mobile Fallback (Performance Optimized) */}
          <div className="absolute inset-0 z-0 md:hidden bg-white dark:bg-[#030303] flex items-center justify-center overflow-hidden pointer-events-none">
             {/* react-doctor-disable-next-line */}
             <img 
               src="/Gargantua.jpg"
               className="absolute top-1/2 left-1/2 w-[250%] max-w-none h-auto -translate-y-1/2 -translate-x-[70%] opacity-[0.15] dark:opacity-30 grayscale contrast-[1.5] dark:mix-blend-screen mix-blend-multiply"
               alt="Black Hole"
             />
             {/* Fade out the edges */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#ffffff_70%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_20%,#030303_70%)]" />
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-7xl lg:text-8xl font-serif italic mb-6 text-black dark:text-white drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] text-center leading-[1.1] tracking-tight"
            >
              Let's Create <br />
              <span className="text-black/60 dark:text-white/60">Something Great.</span>
            </motion.h2>
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center mt-12 pointer-events-auto"
            >
              <a
                href="mailto:tarunasthana2005@gmail.com"
                className="group relative text-lg md:text-2xl font-light text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors py-2"
              >
                <span className="relative z-10">tarunasthana2005@gmail.com</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black dark:bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </a>
            </motion.div>
          </div>

          {/* Minimalist Footer Bar */}
          <div className="absolute bottom-0 left-0 w-full px-6 pb-12 pt-16 md:py-8 md:px-12 flex flex-col-reverse md:flex-row gap-6 md:gap-0 justify-between items-center z-10 pointer-events-auto bg-gradient-to-t from-white/90 dark:from-black/80 via-white/80 dark:via-black/80 to-transparent">
            
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-black/40 dark:text-white/40 text-xs md:text-sm font-light md:pl-[14rem] text-center md:text-left">
              <span suppressHydrationWarning>© {new Date().getFullYear()} Tarun Asthana.</span>
              <span className="hidden md:inline text-black/20 dark:text-white/20">|</span>
              <span className="flex items-center gap-1.5">Crafted with <span className="text-black/60 dark:text-white/60">immaculate vibes</span> <Sparkles size={14} className="text-black/60 dark:text-white/60" /></span>
              <span className="hidden md:inline text-black/20 dark:text-white/20">|</span>
              <span className="text-black/30 dark:text-white/30 uppercase tracking-widest font-bold mt-2 md:mt-0 px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">v1.0</span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 md:pr-4">
              <LinkPreview
                url="https://www.linkedin.com/in/tarun-asthana"
                isStatic={true}
                imageSrc="/linkedin-preview.png"
                className="group flex items-center gap-1.5 text-xs md:text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors font-medium"
              >
                LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </LinkPreview>
              <LinkPreview
                url="https://github.com/T4RuN05"
                className="group flex items-center gap-1.5 text-xs md:text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors font-medium"
              >
                GitHub
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </LinkPreview>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
