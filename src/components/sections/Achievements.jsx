"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useInView, AnimatePresence, useTransform, useMotionValue, useSpring, useMotionValueEvent, animate } from "framer-motion";
import { BlurText } from "@/components/ui/BlurText";
import { Trophy, Award, Calendar } from "lucide-react";

const achievementsData = [
  {
    id: 1,
    title: "MoSPI Statathon Top 5 Finalist",
    date: "June 2026",
    category: "National Level",
    description: "Awarded ₹50,000 Government of India seed funding. Top 5 finalist among 6,000+ teams for building NARAD, an AI-powered multi-channel survey platform supporting IVR, WhatsApp, Telegram, and Web across 12 Indian languages.",
    image: "/images/projects/narad/5.png"
  },
  {
    id: 2,
    title: "Best Research Paper Award",
    date: "2026",
    category: "Multicon ICICN",
    description: "Awarded the Best Research Paper at the International Conference on Informatics and Computing in Networking (ICICN) 2026 for outstanding contributions and research.",
    image: "/images/achievements/icicn_award.jpg"
  },
  {
    id: 3,
    title: "Top 10 Finalist",
    date: "2026",
    category: "IEEE Techsangam",
    description: "Secured a position in the Top 10 at the IEEE Techsangam National Hackathon, competing against top engineering teams and demonstrating exceptional problem-solving skills.",
    image: "/images/achievements/techsangam_award.jpeg"
  }
];

const AchievementItem = ({ item, index, activeIndex, setActiveIndex }) => {
  const ref = useRef(null);
  // Triggers when the item hits the middle 20% of the viewport vertically
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  const isActive = activeIndex === index;

  return (
    <div ref={ref} className="min-h-[60vh] flex flex-col justify-center py-12 lg:py-24 transition-opacity duration-700">
      <motion.div
        animate={{ 
          x: isActive ? 0 : -20,
          scale: isActive ? 1 : 0.95
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl glass-card !p-0 backdrop-blur-lg z-20 gpu-accelerate"
      >
        <motion.div
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="p-5 md:p-10"
        >
          {/* Mobile Only: Inline Image */}
          <div className="lg:hidden w-full aspect-video rounded-2xl overflow-hidden mb-4 shadow-xl relative border border-white/5">
            <img 
              src={item.image} 
              alt={item.title} 
              className={`w-full h-full ${item.id === 3 ? "object-contain bg-white/5 p-4" : "object-cover"}`} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3 text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
            <Trophy size={16} className="md:w-[18px] md:h-[18px]" />
            <span>{item.category}</span>
            <span className="text-muted-foreground hidden sm:inline-block mx-1">-</span>
            <Calendar size={14} className="text-muted-foreground hidden sm:inline-block" />
            <span className="text-muted-foreground">{item.date}</span>
          </div>
          
          <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {item.title}
          </h3>
          
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {item.description}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const TiltAchievementCard = ({ activeItem }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full aspect-square max-h-[600px] perspective-[1500px] pointer-events-auto cursor-pointer z-20"
    >
      <motion.div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} 
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl glass-card backdrop-blur-lg !p-0"
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={activeItem.id}
            src={activeItem.image}
            alt={activeItem.title}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.4 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 w-full h-full block ${activeItem.id === 3 ? "object-contain p-4 md:p-8" : "object-cover"}`}
          />
        </AnimatePresence>
        
        {/* Elegant inner gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          className="absolute bottom-6 left-6 right-6 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`text-${activeItem.id}`}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-white/80 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Award size={14} />
            {activeItem.category}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export function Achievements() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end end"]
  });

  const pathProgress = useMotionValue(0);
  const hasTriggeredRef = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.3 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      animate(pathProgress, 1, { duration: 6, ease: "easeInOut" });
    }
  });

  const safeIndex = Math.min(activeIndex, achievementsData.length - 1);
  const activeItem = achievementsData[safeIndex] || achievementsData[0];

  // Centered path for slice aspect ratio. x=500 is the center.
  // Pushed X coordinates closer to 500 to ensure it stays strictly on-screen 
  // even on narrower laptop screens.
  const pathString = `
    M 400,-50 
    C 550,150 650,300 500,500 
    C 350,700 300,850 750,1050 
  `;

  return (
    <section id="achievements" ref={containerRef} className="relative w-full bg-background text-foreground">
      
      {/* 1. Dynamic Blue Snake Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden gpu-accelerate">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full opacity-80 gpu-accelerate">

            
            {/* Faint track */}
            <path 
              d={pathString}
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              fill="none" 
              className="opacity-10"
            />
            
            {/* Core Thick Body Without Glow */}
            <motion.path 
              d={pathString} 
              stroke="#005de8ff" 
              strokeWidth="40" 
              strokeLinecap="round"
              fill="none" 
              style={{ pathLength: pathProgress }} 
              className="opacity-90"
            />
          </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row">
        
        {/* Left Column: The Scrolling List */}
        <div className="w-full lg:w-1/2 pt-[20vh] pb-[40vh] z-10">
          <div className="mb-24">
             <BlurText
               text="Achievements"
               stagger={0.15}
               className="text-4xl md:text-5xl font-serif italic mb-4"
             />
             <BlurText
               text="Milestones, awards, and major highlights from my journey."
               delay={0.2}
               stagger={0.03}
               className="text-muted-foreground max-w-2xl"
             />
          </div>

          {achievementsData.map((ach, idx) => (
             <AchievementItem 
               key={ach.id} 
               item={ach} 
               index={idx} 
               activeIndex={activeIndex} 
               setActiveIndex={setActiveIndex} 
             />
          ))}
        </div>

        {/* Right Column: Sticky Image Reveal (Desktop Only) */}
        <div className="hidden lg:flex w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-[10vh] lg:top-0 items-center justify-center p-8 lg:p-16 z-10 pointer-events-none">
          <TiltAchievementCard activeItem={activeItem} />
        </div>

      </div>
    </section>
  );
}
