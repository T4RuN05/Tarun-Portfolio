"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from "framer-motion";
import { Briefcase, Users, Calendar, X, Paintbrush, PenTool, ArrowLeft, ExternalLink } from "lucide-react";
import { SiCanva, SiCoreldraw, SiReact } from "react-icons/si";
import Matter from "matter-js";
import { BlurText } from "@/components/ui/BlurText";
import { LinkPreview } from "@/components/ui/link-preview";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";

const IconPs = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#001E36" stroke="#31A8FF" strokeWidth="1.5" />
    <text x="12" y="16.5" fontSize="13" fontWeight="900" fontFamily="sans-serif" fill="#31A8FF" textAnchor="middle">Ps</text>
  </svg>
);

const IconAi = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#330000" stroke="#FF9A00" strokeWidth="1.5" />
    <text x="12" y="16.5" fontSize="13" fontWeight="900" fontFamily="sans-serif" fill="#FF9A00" textAnchor="middle">Ai</text>
  </svg>
);

const IconPr = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#00005C" stroke="#EA77FF" strokeWidth="1.5" />
    <text x="12" y="16.5" fontSize="13" fontWeight="900" fontFamily="sans-serif" fill="#EA77FF" textAnchor="middle">Pr</text>
  </svg>
);

const IconCd = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M10.651 0C10.265.019 9.4.272 8.584.657c-.816.39-3.696 2.161-3.752 6.536.072 4.145 3.847 11.191 6.397 13.455 0 0-4.141-6.952-4.439-13.013C6.488 1.575 10.651 0 10.651 0Zm2.679 0s4.159 1.575 3.861 7.635c-.299 6.061-4.439 13.013-4.439 13.013 2.547-2.264 6.324-9.31 6.396-13.455-.057-4.375-2.936-6.146-3.752-6.536C14.58.272 13.715.019 13.33 0Zm-1.38.019a1.088 1.088 0 0 0-.555.144C9.864.99 8.909 3.982 9.177 8.66c.185 3.242 1.009 7.291 2.422 11.988h.7c1.413-4.697 2.24-8.742 2.425-11.984.268-4.677-.688-7.674-2.219-8.501a1.088 1.088 0 0 0-.555-.144ZM7.017 1.066S2.543 2.909 3.431 8.225c.884 5.32 5.588 10.995 6.986 12.2.503.457-5.777-6.548-6.386-12.699-.291-2.323.39-4.9 2.986-6.66Zm9.966 0c2.595 1.76 3.276 4.337 2.985 6.66-.608 6.151-6.888 13.156-6.386 12.699 1.398-1.205 6.103-6.88 6.987-12.2.888-5.316-3.586-7.159-3.586-7.159Zm-6.815 20.78L10.647 24h2.599l.488-2.154h-3.566Z" fill="#21A142" />
  </svg>
);

const IconFilmora = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="5.5" fill="#172B43" />
    <path d="M10.027 3.6L14.053 7.629 9.436 12.252l-.022-.023a1.088 1.088 0 0 0-.158-1.339L5.999 7.63l4.028-4.03Z" fill="#FFFFFF" />
    <path d="M14.528 8l4.027 4.03-8.528 8.536L6 16.536 14.528 8Z" fill="#5CE5B4" />
  </svg>
);

const skillIconMap = {
  "Canva": SiCanva,
  "Photoshop": IconPs,
  "Illustrator": IconAi,
  "Premiere Pro": IconPr,
  "CorelDRAW": IconCd,
  "Filmora": IconFilmora,
  "React.js": SiReact,
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const PhysicsToolkit = ({ skills, isMobile }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const elementsRef = useRef({});
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current || !skills || skills.length === 0 || isMobile) return;

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    let width = sceneRef.current.clientWidth;
    let height = sceneRef.current.clientHeight;

    const ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true, restitution: 0.5 });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true, restitution: 0.5 });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true, restitution: 0.5 });
    const ceiling = Bodies.rectangle(width / 2, -5000, width * 2, 100, { isStatic: true });

    Composite.add(world, [ground, leftWall, rightWall, ceiling]);

    const boxSize = 120;
    const bodies = skills.map((skill, i) => {
      const x = width * 0.3 + Math.random() * (width * 0.4);
      const y = -100 - (i * 180);
      
      const body = Bodies.rectangle(x, y, boxSize, boxSize, {
        restitution: 0.6,
        friction: 0.1,
        density: 0.05,
      });
      Matter.Body.setAngle(body, Math.random() * Math.PI * 2);
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      
      body.label = skill;
      return body;
    });

    Composite.add(world, bodies);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const updateDOM = () => {
      bodies.forEach(body => {
        const el = elementsRef.current[body.label];
        if (el) {
          const tx = body.position.x - boxSize / 2;
          const ty = body.position.y - boxSize / 2;
          el.style.transform = `translate(${tx}px, ${ty}px) rotate(${body.angle}rad)`;
        }
      });
      animationFrameRef.current = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    const handleResize = () => {
      if (!sceneRef.current) return;
      width = sceneRef.current.clientWidth;
      height = sceneRef.current.clientHeight;
      Matter.Body.setPosition(ground, { x: width / 2, y: height + 50 });
      Matter.Body.setPosition(rightWall, { x: width + 50, y: height / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(world);
    };
  }, [skills, isMobile]);

  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-wrap content-start p-6 gap-4 overflow-y-auto">
        {skills?.map((skill) => {
          const Icon = skillIconMap[skill];
          if (!Icon) return null;
          return (
            <div key={skill} className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10" title={skill}>
              <Icon size={28} className="text-white drop-shadow-lg" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={sceneRef} className="absolute inset-0 z-10 pointer-events-none">
      {skills?.map((skill) => {
        const Icon = skillIconMap[skill];
        if (!Icon) return null;
        return (
          <div
            key={skill}
            ref={el => elementsRef.current[skill] = el}
            className="absolute top-0 left-0 w-[120px] h-[120px] flex items-center justify-center will-change-transform"
            title={skill}
          >
            <Icon size={120} className="text-white drop-shadow-2xl" />
          </div>
        );
      })}
    </div>
  );
};

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
    organization: "Computer Society of India - TCET",
    location: "Mumbai, India",
    date: "07/2024 - 05/2025",
    description:
      "Designed and deployed the official CSI TCET website in React.js and led a committee of 50+ members, coordinating technical and creative initiatives.",
    fullDescription: "As the Webmaster for CSI-TCET (2024-25), I orchestrated the complete digital presence of the organization. My role involved leading a dedicated technical and design committee of over 50 members, coordinating cross-functional teams to design, develop, and deploy the official CSI TCET website. \n\nI directly managed the web infrastructure while simultaneously directing the creative team to produce captivating social media content, ensuring cohesive brand communication across all digital touchpoints and flagship events.\n\nBy leveraging my expertise in modern UI/UX design and video production, I instituted a cohesive aesthetic for all club deliverables, which significantly boosted student engagement, streamlined event promotion, and elevated the organization's professional standard on campus.",
    skills: ["Canva", "Photoshop", "Illustrator", "Premiere Pro", "Filmora", "CorelDRAW", "React.js"],
    gallery: Array.from({length: 14}, (_, i) => `/images/timeline/csi/showcase_${i}.png`),
    merchGallery: Array.from({length: 4}, (_, i) => `/images/timeline/csi/merch_${i}.png`),
    link: "https://www.instagram.com/tcet_csi/",
    hasModal: true
  },
];

const TimelineItem = ({ item, index, scrollYProgress, totalItems, pauseRange, onClick }) => {
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

  // 3D Tilt & Local Cursor Hook Implementation
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const cursorXSpring = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const cursorYSpring = useSpring(mouseY, { stiffness: 400, damping: 28 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!item.hasModal || !ref.current || window.innerWidth < 1024) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    mouseX.set(localX);
    mouseY.set(localY);

    const xPct = localX / width - 0.5;
    const yPct = localY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!item.hasModal) return;
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (item.hasModal && window.innerWidth >= 1024) setIsHovered(true);
  };

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

      {/* Content Card Wrapper */}
      <motion.div
        style={{ scale }}
        className="absolute left-1/2 -translate-x-1/2 w-[90vw] max-w-lg top-[calc(35%+2.5rem)] md:top-[calc(45%+3rem)]"
      >
        <motion.div 
          ref={ref}
          onClick={item.hasModal ? () => onClick(item) : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "h-full w-full relative",
            item.hasModal && "cursor-none perspective-[1500px]"
          )}
          data-hide-cursor={item.hasModal ? "true" : undefined}
        >
          <motion.div
            style={item.hasModal ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
            className="h-full w-full relative"
          >
            {/* 3D Local Cursor */}
            {item.hasModal && (
              <motion.div
                 className="absolute top-0 left-0 h-10 px-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold tracking-widest uppercase text-[11px] pointer-events-none z-[100] shadow-[0_0_20px_rgba(var(--primary),0.5)] whitespace-nowrap"
                 style={{
                   x: useTransform(cursorXSpring, (val) => val - 60),
                   y: useTransform(cursorYSpring, (val) => val - 20),
                   transform: "translateZ(80px)",
                 }}
                 animate={{
                   scale: isHovered ? 1 : 0,
                   opacity: isHovered ? 1 : 0,
                 }}
               >
                 View Details
               </motion.div>
            )}

            {/* Actual Card Content */}
            <div className={cn(
              "glass-card backdrop-blur-lg h-full transition-all duration-300 relative overflow-hidden group w-full",
              item.hasModal && "hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
            )}>
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
              <motion.h3 
                layoutId={`timeline-title-${item.id}`}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl md:text-2xl font-bold text-foreground mb-1"
              >
                {item.title}
              </motion.h3>
              <h4 className="text-sm text-primary font-bold tracking-widest mb-4 uppercase">
                {item.organization} • {item.location}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };

export function Timeline() {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const scrollDataRef = useRef({ startTime: null, startProgress: null });
  const [selectedItem, setSelectedItem] = useState(null);
  const globalLenis = useLenis();

  // Scroll locking for modal
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (globalLenis) globalLenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (globalLenis) globalLenis.start();
    }
  }, [selectedItem, globalLenis]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Performance-safe speedrun detection for the Timeline specifically
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const data = scrollDataRef.current;

      if (latest > 0.05 && latest < 0.95) {
        if (!data.startTime) {
          data.startTime = Date.now();
          data.startProgress = latest;
        }
      } else {
        if (data.startTime) {
          const duration = Date.now() - data.startTime;
          const distance = Math.abs(latest - data.startProgress);
          
          if (duration < 4000 && distance > 0.8) {
            window.dispatchEvent(new CustomEvent('speedrun-detected'));
          }
          
          data.startTime = null;
          data.startProgress = null;
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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
                onClick={setSelectedItem}
              />
            ))}
          </motion.div>
        </div>
      </div>      {/* Cinematic Modal Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-[100] block lg:flex lg:flex-row items-center justify-center pointer-events-auto overflow-y-auto lg:overflow-hidden bg-background/95 backdrop-blur-2xl p-4 lg:p-8 gap-8"
            data-lenis-prevent="true"
          >
            {/* Left Panel: Header & Controls */}
            <div className="w-full lg:w-1/3 xl:w-1/4 min-h-[50vh] lg:h-full flex flex-col justify-center items-start z-[110] relative pt-20 lg:pt-0 lg:pl-8 pb-8 lg:pb-0 shrink-0">
              {/* Back Button */}
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.3 }}
                onClick={() => setSelectedItem(null)}
                className="absolute top-0 left-0 lg:top-8 lg:left-8 z-[120] px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full backdrop-blur-xl transition-all flex items-center gap-2 group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-bold tracking-widest uppercase">Back</span>
              </motion.button>

              <div className="mt-8 lg:mt-0 flex flex-col items-start text-left">
                <motion.h2 
                  layoutId={`timeline-title-${selectedItem.id}`}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-5xl xl:text-6xl font-bold text-foreground uppercase tracking-tight leading-none"
                >
                  {selectedItem.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-primary tracking-widest uppercase font-bold text-sm md:text-lg mt-6 text-left"
                >
                  {selectedItem.organization}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="flex gap-4 mt-8 lg:mt-12"
                >
                  {selectedItem.link && selectedItem.link !== "#" && (
                    <LinkPreview 
                      url={selectedItem.link} 
                      className="flex items-center gap-2 px-6 py-3 bg-foreground !text-background rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl"
                    >
                      Visit Instagram <ExternalLink size={16} />
                    </LinkPreview>
                  )}
                </motion.div>
              </div>
              

            </div>

            {/* Right Panel: Advanced Bento Grid */}
            <div className="w-full lg:flex-1 lg:h-full lg:max-h-[calc(100vh-4rem)] relative z-[105] lg:overflow-hidden pb-20 lg:pb-0 mt-8 lg:mt-0">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-4 lg:gap-6 lg:h-full lg:min-h-[700px]">
                
                {/* Box 1: Role & Impact (Col 1-2, Row 1) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="lg:col-span-2 lg:row-span-1 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md flex flex-col overflow-hidden relative min-h-[250px] lg:min-h-0"
                >
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="absolute inset-0 flex flex-col">
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10 pb-20">
                      <div className="text-muted-foreground leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                        {selectedItem.fullDescription}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none z-20">
                      <h3 className="text-foreground font-bold text-lg leading-tight flex items-center gap-2">
                         <Users className="text-primary" size={20} /> Role & Impact
                      </h3>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Box 2: Toolkit (Col 1, Row 2) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="lg:col-span-1 lg:row-span-1 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md relative overflow-hidden min-h-[200px] lg:min-h-0"
                >
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute inset-0">
                    <PhysicsToolkit skills={selectedItem.skills} isMobile={isMobile} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none z-20">
                      <h3 className="text-foreground font-bold text-lg leading-tight">Toolkit</h3>
                      <p className="text-foreground/60 text-xs tracking-widest uppercase mt-1">Core Skills</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Box 3: Instagram Reels (Col 4, Row 1-2) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="lg:col-span-1 lg:row-span-2 bg-background border border-foreground/10 rounded-3xl overflow-hidden relative min-h-[350px] lg:min-h-0"
                >
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.8 }} className="absolute inset-0">
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <motion.div
                        animate={isMobile ? {} : { y: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                        className={cn("flex flex-col gap-4 p-4", isMobile && "overflow-y-auto h-full pb-20 pointer-events-auto")}
                      >
                        {(isMobile ? [1, 2, 3, 4] : [1, 2, 3, 4, 1, 2, 3, 4]).map((num, idx) => (
                          <video 
                            key={idx}
                            src={`/assets/reels/reel-${num}.mp4#t=3.0`}
                            className="w-full rounded-xl shadow-lg border border-foreground/10 object-cover"
                            autoPlay={!isMobile}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        ))}
                      </motion.div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                      <h3 className="text-white font-bold text-lg leading-tight">Instagram Reels</h3>
                      <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Social Media</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Box 4: Digital Showcase (Col 3-4, Row 1-2) */}
                {selectedItem.gallery && selectedItem.gallery.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="lg:col-span-2 lg:row-span-2 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md overflow-hidden relative min-h-[300px]"
                  >
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6 z-30 pointer-events-none">
                        <h3 className="text-white font-bold text-2xl leading-tight">Digital Showcase</h3>
                        <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Interactive 3D Gallery</p>
                      </div>
                      {/* The 3D Stage or Mobile Auto-Scroll Grid */}
                      {isMobile ? (
                        <div className="absolute inset-0 w-full h-full pt-4 pb-24 px-4 overflow-y-auto pointer-events-auto">
                           <div className="columns-2 gap-3 space-y-3">
                             {selectedItem.gallery?.map((img, idx) => (
                               <div key={idx} className="break-inside-avoid">
                                 <img src={img} draggable={false} alt="Showcase" className="w-full rounded-xl shadow-lg border border-foreground/10 object-cover" />
                               </div>
                             ))}
                           </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-background/60 overflow-hidden perspective-[1200px]">
                          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/90 to-transparent z-20 pointer-events-none" />
                          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/90 to-transparent z-20 pointer-events-none" />
                          
                          <div 
                            className="absolute inset-[-60%] md:inset-[-40%] pointer-events-none"
                            style={{
                              transform: "rotateX(15deg) rotateY(20deg) rotateZ(-10deg) scale(0.95)",
                              transformStyle: "preserve-3d"
                            }}
                          >
                            <motion.div 
                              animate={{ x: ["0%", "-25%"] }}
                              transition={{ repeat: Infinity, ease: "linear", duration: 160 }}
                              className="flex pointer-events-none"
                              style={{ width: "400%" }}
                            >
                              {[0, 1, 2, 3].map((set) => (
                                <div key={`set-${set}`} className="flex flex-1">
                                    <motion.div animate={{ y: ["0%", "-25%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 80 }} className="flex flex-col flex-1 pr-4 md:pr-6 pointer-events-auto">
                                      {[...selectedItem.gallery.slice(0, 5), ...selectedItem.gallery.slice(0, 5), ...selectedItem.gallery.slice(0, 5), ...selectedItem.gallery.slice(0, 5)].map((img, idx) => (
                                        <div key={`col1-${idx}`} className="w-full shrink-0 rounded-xl overflow-hidden border border-foreground/10 shadow-2xl transition-transform hover:scale-[1.03] hover:border-primary/50 cursor-crosshair mb-4 md:mb-6">
                                          <img src={img} draggable={false} alt="Showcase" className="w-full h-auto object-cover pointer-events-none select-none" />
                                        </div>
                                      ))}
                                    </motion.div>
                                    <motion.div animate={{ y: ["-25%", "0%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 90 }} className="flex flex-col flex-1 pr-4 md:pr-6 pointer-events-auto">
                                      {[...selectedItem.gallery.slice(5, 10), ...selectedItem.gallery.slice(5, 10), ...selectedItem.gallery.slice(5, 10), ...selectedItem.gallery.slice(5, 10)].map((img, idx) => (
                                        <div key={`col2-${idx}`} className="w-full shrink-0 rounded-xl overflow-hidden border border-foreground/10 shadow-2xl transition-transform hover:scale-[1.03] hover:border-primary/50 cursor-crosshair mb-4 md:mb-6">
                                          <img src={img} draggable={false} alt="Showcase" className="w-full h-auto object-cover pointer-events-none select-none" />
                                        </div>
                                      ))}
                                    </motion.div>
                                    <motion.div animate={{ y: ["0%", "-25%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 70 }} className="flex flex-col flex-1 pointer-events-auto pr-4 md:pr-6 hidden md:flex">
                                      {[...selectedItem.gallery.slice(10, 14), selectedItem.gallery[0], ...selectedItem.gallery.slice(10, 14), selectedItem.gallery[0], ...selectedItem.gallery.slice(10, 14), selectedItem.gallery[0], ...selectedItem.gallery.slice(10, 14), selectedItem.gallery[0]].map((img, idx) => (
                                        <div key={`col3-${idx}`} className="w-full shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-transform hover:scale-[1.03] hover:border-primary/50 cursor-crosshair mb-4 md:mb-6">
                                          <img src={img} draggable={false} alt="Showcase" className="w-full h-auto object-cover pointer-events-none select-none" />
                                        </div>
                                      ))}
                                    </motion.div>
                                </div>
                              ))}
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Box 5: Core Team Hoodie (swapped with Jersey) */}
                {selectedItem.merchGallery && selectedItem.merchGallery.length > 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="lg:col-span-1 lg:row-span-1 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md overflow-hidden group relative min-h-[200px]"
                  >
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} className="absolute inset-0">
                       <img src={selectedItem.merchGallery[3]} alt="Core Team Hoodie" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                         <h3 className="text-white font-bold text-lg leading-tight">Core Team Hoodie</h3>
                         <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Apparel Design</p>
                       </div>
                     </motion.div>
                  </motion.div>
                )}

                {/* Box 6: Lanyard Collage */}
                {selectedItem.merchGallery && selectedItem.merchGallery.length > 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="lg:col-span-1 lg:row-span-1 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md overflow-hidden group relative min-h-[200px] flex flex-col"
                  >
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }} className="absolute inset-0 flex flex-col">
                       {/* Collage of two lanyards (indices 1 and 2) */}
                       <div className="w-full h-1/2 relative overflow-hidden border-b border-foreground/10">
                          <img src={selectedItem.merchGallery[1]} alt="Lanyard 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       </div>
                       <div className="w-full h-1/2 relative overflow-hidden">
                          <img src={selectedItem.merchGallery[2]} alt="Lanyard 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 pointer-events-none z-10">
                         <h3 className="text-white font-bold text-lg leading-tight">Event Lanyard</h3>
                         <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Physical Print</p>
                       </div>
                     </motion.div>
                  </motion.div>
                )}

                {/* Box 7: Jersey (swapped with Hoodie) */}
                {selectedItem.merchGallery && selectedItem.merchGallery.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="lg:col-span-1 lg:row-span-1 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md overflow-hidden group relative min-h-[200px]"
                  >
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }} className="absolute inset-0">
                       <img src={selectedItem.merchGallery[0]} alt="Event Jersey" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                         <h3 className="text-white font-bold text-lg leading-tight">Event Jersey</h3>
                         <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Apparel Design</p>
                       </div>
                     </motion.div>
                  </motion.div>
                )}

                {/* Box 8: Blank (Col 4, Row 3) */}
                <div className="lg:col-span-1 lg:row-span-1 hidden lg:block rounded-3xl" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
