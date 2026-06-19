"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 15%"]
  });

  const topDotScale = useTransform(scrollYProgress, [0.7, 0.8, 0.9], [0.5, 1.3, 1]);
  const topContentOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0.3, 1]);

  const bottomDotScale = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0.5, 1.3, 1]);
  const bottomContentOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0.3, 1]);

  return (
    <section id="about" ref={containerRef} className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif italic mb-6"
          >
            About Me
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed mb-6"
          >
            I’m a creative and passionate UI/UX and Full Stack Developer who enjoys transforming ideas into clean, intuitive, and engaging digital experiences. I blend modern design aesthetics with robust engineering to craft seamless, user-friendly interfaces.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            I value thoughtful design, attention to detail, and continuous improvement—always aiming to make every interface more aesthetic, functional, and meaningful.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-card backdrop-blur-lg flex flex-col gap-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold uppercase tracking-wider">Education</h3>
          </div>

          <div className="relative flex flex-col">
            {/* Background Line */}
            <div className="absolute left-0 top-3 bottom-0 w-[2px] bg-primary/20" />
            
            {/* Animated Scroll Progress Line */}
            <motion.div 
              style={{ scaleY: scrollYProgress }}
              className="absolute left-0 top-3 bottom-0 w-[2px] bg-primary origin-bottom"
            />

            <motion.div style={{ opacity: topContentOpacity }} className="relative pl-6 pb-8 transition-opacity duration-300">
              <motion.div style={{ scale: topDotScale }} className="absolute w-3 h-3 bg-primary rounded-full -left-[5px] top-2 z-10" />
              <h4 className="text-xl font-bold mb-1">B.E. Computer Engineering</h4>
              <p className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
                Thakur College of Engineering and Technology
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground font-medium mb-2">
                <span>Mumbai, India</span>
                <span className="hidden md:inline">•</span>
                <span>07/2023 - 05/2027</span>
              </div>
              <p className="text-sm text-foreground/80 font-semibold">CGPA: 9.39</p>
            </motion.div>

            <motion.div style={{ opacity: bottomContentOpacity }} className="relative pl-6 pb-2 transition-opacity duration-300">
              <motion.div style={{ scale: bottomDotScale }} className="absolute w-3 h-3 bg-primary rounded-full -left-[5px] top-2 z-10" />
              <h4 className="text-xl font-bold mb-1">HSC Science</h4>
              <p className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
                Nirmala College of Commerce and Science
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground font-medium mb-2">
                <span>Mumbai, India</span>
                <span className="hidden md:inline">•</span>
                <span>06/2021 - 05/2023</span>
              </div>
              <p className="text-sm text-foreground/80 font-semibold">Percentage: 74%</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
