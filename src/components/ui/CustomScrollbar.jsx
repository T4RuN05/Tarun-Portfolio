"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";

const sections = [
  { id: "home", label: "Intro" },
  { id: "about", label: "About" },
  { id: "experience", label: "Timeline" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" }
];

export function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  const [activeSection, setActiveSection] = useState("Intro");
  const [isScrolling, setIsScrolling] = useState(false);
  const [sectionHeights, setSectionHeights] = useState(
    sections.map(() => 100 / sections.length)
  );

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide label 1.5s after scrolling stops
    };

    const updateHeights = () => {
      const heights = sections.map((sec) => {
        const el = document.getElementById(sec.id);
        return el ? el.offsetHeight : 0;
      });
      const totalTrackedHeight = heights.reduce((a, b) => a + b, 0);
      
      const newHeightsPercentages = heights.map((h) => 
        totalTrackedHeight ? (h / totalTrackedHeight) * 100 : (100 / sections.length)
      );
      setSectionHeights(newHeightsPercentages);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeights);
    
    handleScroll();
    // Initial delay to ensure DOM is fully painted and heights are stable
    setTimeout(updateHeights, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeights);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Sync active section exactly with the visual progress bar position
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    let cumulative = 0;
    let newActive = sections[0].label;
    
    for (let i = 0; i < sectionHeights.length; i++) {
      cumulative += sectionHeights[i] / 100;
      if (latest <= cumulative + 0.005) { // Adding a tiny epsilon to handle floating point edges
        newActive = sections[i].label;
        break;
      }
    }
    
    // Ensure it always shows the last section if scrolled to the absolute bottom
    if (latest >= 0.99) {
      newActive = sections[sections.length - 1].label;
    }
    
    if (newActive !== activeSection) {
      setActiveSection(newActive);
    }
  });

  return (
    <div className="fixed right-6 top-0 bottom-0 w-8 z-50 pointer-events-none hidden md:flex flex-col justify-center mix-blend-difference">
      <div className="relative w-full h-[50vh] flex justify-end">
        
        {/* Partitioned Track Line (Background) */}
        <div className="absolute right-0 top-0 bottom-0 w-[3px] flex flex-col justify-between">
          {sections.map((_, i) => (
            <div key={i} className="w-full bg-white/20 rounded-full" style={{ height: `calc(${sectionHeights[i]}% - 6px)` }} />
          ))}
        </div>
        
        {/* Progress Bar (Foreground, clipped by expanding height) */}
        <motion.div
          style={{ 
            height: useTransform(smoothProgress, [0, 1], ["0%", "100%"])
          }}
          className="absolute top-0 right-0 w-[3px] overflow-hidden origin-top"
        >
          {/* Inner track must be fixed to the total height to avoid squishing */}
          <div className="w-full flex flex-col justify-between" style={{ height: "50vh" }}>
            {sections.map((_, i) => (
              <div key={i} className="w-full bg-white rounded-full" style={{ height: `calc(${sectionHeights[i]}% - 6px)` }} />
            ))}
          </div>
        </motion.div>

        {/* Label Container (Moves with leading edge, outside overflow-hidden) */}
        <motion.div
          style={{ 
            top: useTransform(smoothProgress, [0, 1], ["0%", "100%"])
          }}
          className="absolute top-0 right-0 w-[3px] pointer-events-none"
        >
          <AnimatePresence>
            {isScrolling && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute right-full mr-4 top-0 -translate-y-1/2 flex items-center"
              >
                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white whitespace-nowrap drop-shadow-md">
                   {activeSection}
                 </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
