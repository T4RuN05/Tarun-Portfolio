"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Briefcase, Users, Calendar } from "lucide-react";
import { BlurText } from "@/components/ui/BlurText";
import { cn } from "@/lib/utils";

const timelineData = [
  {
    id: 1,
    type: "experience",
    title: "Machine Learning Intern",
    organization: "Sequretek IT Solutions Pvt Ltd",
    location: "Mumbai, India",
    date: "04/2026 - Present",
    description:
      "Researched and applied graph-based correlation techniques on cybersecurity telemetry data to improve attack detection accuracy, event clustering, and large-scale threat analysis pipelines.",
  },
  {
    id: 2,
    type: "experience",
    title: "Frontend Web Developer Intern",
    organization: "The Lonely Bag Pvt. Ltd.",
    location: "Mumbai, India",
    date: "11/2025 - 01/2026",
    description:
      "Developed and optimized responsive web pages using Next.js and Tailwind CSS, delivering new features, resolving frontend defects, and improving rendering speed.",
  },
  {
    id: 3,
    type: "experience",
    title: "AI Developer Intern",
    organization: "VIDYARTHI MITRA Org.",
    location: "Mumbai, India",
    date: "12/2025 - 01/2026",
    description:
      "Built automated data extraction and validation pipelines using Python to process large, unstructured datasets, and redesigned a production MERN stack website with AI-based content processing for regional-language insights.",
  },
  {
    id: 4,
    type: "extracurricular",
    title: "UI/UX & Full Stack Developer",
    organization: "Rotaract Club of TCET",
    location: "Mumbai, India",
    date: "07/2025 - 05/2026",
    description:
      "Redesigned the complete club website with a user-centered UI/UX approach, improving visual hierarchy, navigation, and user engagement, including fully integrated dark mode.",
  },
  {
    id: 5,
    type: "extracurricular",
    title: "Webmaster",
    organization: "Computer Society of India – TCET",
    location: "Mumbai, India",
    date: "07/2024 - 05/2025",
    description:
      "Designed and deployed the official CSI TCET website in React.js and led a committee of 50+ members, coordinating technical and creative initiatives.",
  },
];

const TimelineItem = ({ item, index, scrollYProgress, totalItems, pauseRange }) => {
  const threshold = index / (totalItems - 0.5);
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  let opacityInputs, opacityOutputs;
  let scaleInputs, scaleOutputs;

  if (isFirst) {
    opacityInputs = [0, 0.15];
    opacityOutputs = [1, 1];
    
    scaleInputs = [0, pauseRange, 0.15];
    scaleOutputs = [1, 1, 0.8];
  } else if (isLast) {
    opacityInputs = [threshold - 0.25, threshold - 0.1, 1];
    opacityOutputs = [0.3, 1, 1];

    scaleInputs = [threshold - 0.25, threshold - 0.1, 1];
    scaleOutputs = [0.8, 1, 1];
  } else {
    opacityInputs = [threshold - 0.15, threshold - pauseRange, threshold + pauseRange, threshold + 0.15];
    opacityOutputs = [0.3, 1, 1, 0.3];

    scaleInputs = [threshold - 0.15, threshold - pauseRange, threshold + pauseRange, threshold + 0.15];
    scaleOutputs = [0.8, 1, 1, 0.8];
  }

  const opacity = useTransform(scrollYProgress, opacityInputs, opacityOutputs, { clamp: true });
  const scale = useTransform(scrollYProgress, scaleInputs, scaleOutputs, { clamp: true });

  return (
    <motion.div style={{ opacity }} className="gpu-accelerate relative w-[100vw] h-full shrink-0 flex items-center justify-center">
      {/* Center Line Dot */}
      <motion.div 
        style={{ scale }} 
        className="absolute top-[35%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass shadow-lg flex items-center justify-center border border-primary/20"
      >
        {item.type === "experience" ? (
          <Briefcase className="w-5 h-5 text-primary" />
        ) : (
          <Users className="w-5 h-5 text-primary" />
        )}
      </motion.div>

      {/* Content Card */}
      <motion.div
        style={{ scale }}
        className="absolute left-1/2 -translate-x-1/2 w-[90vw] max-w-lg top-[calc(35%+2.5rem)] md:top-[calc(45%+3rem)]"
      >
        <div className="glass-card backdrop-blur-lg h-full transition-colors hover:border-primary/30">
          <div className="flex flex-col md:hidden items-start mb-4 gap-2">
             <div className="flex items-center gap-2 text-primary">
                {item.type === "experience" ? <Briefcase size={18} /> : <Users size={18} />}
                <span className="font-semibold capitalize text-sm">{item.type}</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-3">
            <Calendar className="w-4 h-4" />
            <span>{item.date}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            {item.title}
          </h3>
          <h4 className="text-sm text-primary font-bold tracking-widest mb-4 uppercase">
            {item.organization} • {item.location}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function Timeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const totalItems = timelineData.length;
  const scrollDistance = (totalItems - 1) * 100;
  const pauseRange = 0.08; // Slightly larger range to give the spring room to snap
  
  // Calculate arrays for sticky scroll mapping
  const inputs = [];
  const outputsTrack = [];
  const outputsProgress = [];
  
  for (let i = 0; i < totalItems; i++) {
    const baseProgress = i / (totalItems - 0.5);
    const valTrack = -i * 100;
    const valProgress = i * 100;

    if (i === 0) {
      inputs.push(0, baseProgress + pauseRange);
      outputsTrack.push(valTrack, valTrack);
      outputsProgress.push(valProgress, valProgress);
    } else if (i === totalItems - 1) {
      inputs.push(baseProgress - pauseRange, 1);
      outputsTrack.push(valTrack, valTrack);
      outputsProgress.push(valProgress, valProgress);
    } else {
      inputs.push(baseProgress - pauseRange, baseProgress + pauseRange);
      outputsTrack.push(valTrack, valTrack);
      outputsProgress.push(valProgress, valProgress);
    }
  }
  
  // Track translates horizontally with built-in pauses (raw numbers)
  const xNum = useTransform(scrollYProgress, inputs, outputsTrack);
  const progressNum = useTransform(scrollYProgress, inputs, outputsProgress);

  // Apply a spring to smooth the sharp corners of the lock into a magnetic snap
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const xSpring = useSpring(xNum, springConfig);
  const progressSpring = useSpring(progressNum, springConfig);

  // Convert the sprung numbers to vw units
  const x = useTransform(xSpring, (val) => `${val}vw`);
  const progressWidth = useTransform(progressSpring, (val) => `${val}vw`);

  return (
    <section 
      id="experience" 
      ref={containerRef} 
      style={{ height: `${totalItems * 75}vh` }} 
      className="relative bg-background"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* Header - Fixed at top of screen */}
        <div className="absolute top-0 left-0 w-full pt-20 md:pt-36 pb-8 md:pb-16 px-4 z-20 pointer-events-none bg-gradient-to-b from-background via-background/95 to-transparent">
          <div className="max-w-7xl mx-auto text-center">
            <BlurText
              text="Experience & Activities"
              stagger={0.15}
              className="text-3xl md:text-5xl font-serif italic mb-2 md:mb-4 justify-center"
            />
            <BlurText
              text="My journey through academia and professional roles, building expertise in full-stack development and machine learning."
              delay={0.2}
              stagger={0.03}
              className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto justify-center"
            />
          </div>
        </div>

        {/* Horizontal Track Wrapper */}
        <div className="relative flex-1 flex items-center mt-20 md:mt-0">
          <motion.div className="flex h-full" style={{ width: `${totalItems * 100}vw`, x }}>
            
            {/* Background Track Line */}
            <div 
              className="absolute top-[35%] md:top-[45%] left-[50vw] h-[2px] bg-primary/20 -translate-y-1/2" 
              style={{ width: `${scrollDistance}vw` }}
            />
            
            {/* Animated Progress Line */}
            <motion.div 
              style={{ width: progressWidth }}
              className="absolute top-[35%] md:top-[45%] left-[50vw] h-[2px] bg-primary -translate-y-1/2 origin-left z-0"
            />

            {/* Glowing Tip */}
            <motion.div 
              style={{ x: progressWidth }}
              className="absolute top-[35%] md:top-[45%] left-[50vw] z-0"
            >
              {/* Outer soft glow */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-primary/20 blur-xl rounded-full pointer-events-none" />
              {/* Inner bright core */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-primary/50 blur-md rounded-full pointer-events-none" />
              {/* Sharp center */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-white blur-[1px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Timeline Items */}
            {[...timelineData].reverse().map((item, index) => (
              <TimelineItem 
                key={item.id} 
                item={item} 
                index={index} 
                scrollYProgress={scrollYProgress} 
                totalItems={totalItems} 
                pauseRange={pauseRange}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
