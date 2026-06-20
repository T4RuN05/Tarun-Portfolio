
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { ReactLenis, useLenis } from "lenis/react";
import Lenis from "lenis";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { BlurText } from "@/components/ui/BlurText";
import { LinkPreview } from "@/components/ui/link-preview";
import { cn } from "@/lib/utils";
import { sendGAEvent } from '@next/third-parties/google';

const SMOOTH_TRANSITION = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

const projects = [
  {
    id: 1,
    title: "NARAD",
    subtitle: "National Automated Response & Data System",
    description:
      "Engineered 4 role-based admin dashboards and an AI Avatar survey channel using Three.js and Sarvam AI STT/TTS for real-time Indian-language voice processing. Awarded ₹50,000 Govt. of India seed funding.",
    tags: ["Node.js", "MongoDB", "React.js", "Three.js"],
    image: "/images/projects/narad/5.png",
    gallery: [
      "/images/projects/narad/5.png",
      "/images/projects/narad/6.png",
      "/images/projects/narad/7.png"
    ],
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "Lord Ganesha Impex",
    subtitle: "B2B E-Commerce Platform",
    description:
      "Designed and developed responsive, cross-device front-end components for a production web platform, improving usability and page rendering performance with interactive UI animations.",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    image: "/images/projects/ganesha/1.webp",
    gallery: [
      "/images/projects/ganesha/1.webp",
      "/images/projects/ganesha/2.webp",
      "/images/projects/ganesha/3.webp",
      "/images/projects/ganesha/4.webp"
    ],
    link: "https://www.lordganeshaimpex.com",
    github: "#",
  },
  {
    id: 3,
    title: "Traffic Monitoring Dashboard",
    subtitle: "Smart Dashboard UI/UX",
    description:
      "A full-fledged dashboard design for SMART traffic monitoring, focusing on clean data visualization and an intuitive user interface.",
    tags: ["Figma", "UI/UX", "Dashboard"],
    image: "/images/projects/traffic/8.png",
    gallery: [
      "/images/projects/traffic/8.png",
      "/images/projects/traffic/9.png"
    ],
    link: "#",
  },
  {
    id: 4,
    title: "TV9 Mobile App",
    subtitle: "Second Screen Experience",
    description:
      "A hackathon project remaking the TV9 application with an engaging and dynamic 'second screen' option to let users engage with live broadcasts dynamically.",
    tags: ["Figma", "Mobile App", "Hackathon"],
    image: "/images/projects/tv9/10.png",
    gallery: [
      "/images/projects/tv9/10.png",
      "/images/projects/tv9/11.png"
    ],
    link: "#",
  },
];

const TiltCard = ({ image }) => {
  const isTraffic = image && image.includes("/traffic/");
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || window.innerWidth < 1024) return;
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
      className="relative w-full aspect-video cursor-pointer perspective-[1000px] z-20"
    >
      <motion.div 
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} 
        className="relative w-full h-full overflow-hidden shadow-2xl bg-secondary/20 border border-white/10 rounded-xl"
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={image}
            initial={{ opacity: 0, scale: isTraffic ? 1.35 : 1 }}
            animate={{ opacity: 1, scale: isTraffic ? 1.35 : 1 }}
            exit={{ opacity: 0, scale: isTraffic ? 1.35 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={image} 
            alt="Project showcase"
            className="w-full h-full object-cover absolute inset-0 block" 
          />
        </AnimatePresence>
        
        {/* Dynamic Highlight overlay */}
        <motion.div 
           className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 mix-blend-overlay pointer-events-none"
           style={{
             opacity: useTransform(y, [-0.5, 0.5], [0, 1]),
           }}
        />
      </motion.div>
    </motion.div>
  );
};

const ScrollThumbnail = ({ img, activeImage, setActiveImage, distance, isMobile }) => {
  let scaleClass = "scale-100 opacity-100 z-10 shadow-[0_0_30px_rgba(255,255,255,0.15)]";
  
  if (!isMobile) {
    if (distance === 1) scaleClass = "scale-[0.85] opacity-60";
    else if (distance === 2) scaleClass = "scale-[0.70] opacity-40";
    else if (distance >= 3) scaleClass = "scale-[0.55] opacity-20";
  } else {
    // Mobile active state
    scaleClass = activeImage === img 
      ? "scale-100 opacity-100 border border-primary shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
      : "scale-95 opacity-40 border border-white/5";
  }

  return (
    <div 
      onClick={() => setActiveImage(img)}
      className={cn(
        "rounded-lg overflow-hidden shrink-0 transition-all duration-500 origin-center flex items-center justify-center bg-secondary/10 cursor-pointer",
        isMobile ? "w-[80px] h-[60px]" : "w-full h-[100px]",
        scaleClass
      )}
    >
      <img src={img} className="w-full h-full object-cover transition-transform duration-700" />
    </div>
  );
};

const ProjectCard = ({ project, index, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || window.innerWidth < 1024) return;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full cursor-pointer perspective-[1500px]"
      onClick={() => onClick(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        <SpotlightCard className="group relative flex flex-col glass-card overflow-hidden hover:border-primary/40 transition-colors h-full">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-secondary/50">
        <motion.img
          initial={{ scale: project.id === 3 ? 1.35 : 1 }}
          whileHover={{ scale: project.id === 3 ? 1.45 : 1.05 }}
          transition={{ duration: 0.4 }}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <ExternalLink size={20} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          )}
        </div>
      </div>
      
      <div className="flex flex-col flex-grow relative z-10">
        <motion.h2 
          layoutId={`title-${project.id}`} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-bold text-foreground mb-1"
        >
          {project.title}
        </motion.h2>
        <p className="text-primary font-bold tracking-wider uppercase text-sm mb-3">
          {project.subtitle}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-secondary/50 rounded-full border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      </SpotlightCard>
      </motion.div>
    </motion.div>
  );
};

export function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const thumbScrollRef = useRef(null);
  const globalLenis = useLenis(); // Captures the main site's physics engine

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Auto-Slideshow & Auto-Scroll
  useEffect(() => {
    if (isMobile && selectedProject && selectedProject.gallery) {
      const interval = setInterval(() => {
        setActiveImage((prev) => {
          const currentIndex = selectedProject.gallery.indexOf(prev);
          const nextIndex = (currentIndex + 1) % selectedProject.gallery.length;
          
          if (thumbScrollRef.current) {
            const container = thumbScrollRef.current;
            container.scrollTo({
              left: nextIndex * 96, // 80px width + 16px gap
              behavior: 'smooth'
            });
          }
          
          return selectedProject.gallery[nextIndex];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMobile, selectedProject]);

  // 1:1 Mapped Scroll Physics (Bypassing useScroll hydration crash)
  const scrollY = useMotionValue(0);
  const trackY = useTransform(scrollY, (val) => -50 - val);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setActiveImage(selectedProject.image);
      const hash = `#${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}`;
      window.history.pushState(null, '', hash);
      
      // Stop global trackpad interception to prevent fighting the overlay
      if (globalLenis) globalLenis.stop();

      let lenis;
      let frameId;

      // Ensure DOM is painted before attaching Lenis
      setTimeout(() => {
        if (overlayRef.current && contentRef.current) {
          lenis = new Lenis({
            wrapper: overlayRef.current,
            content: contentRef.current,
            lerp: 0.08,
            smoothWheel: true,
          });

          // Update framer-motion value and compute active image directly from Lenis tick
          lenis.on('scroll', (e) => {
            if (window.innerWidth < 1024) return; // Disconnect scroll mapping on mobile
            
            scrollY.set(e.scroll);

            if (!selectedProject.gallery) return;
            const activeIdx = Math.max(0, Math.min(selectedProject.gallery.length - 1, Math.round(e.scroll / 116)));
            const targetImage = selectedProject.gallery[activeIdx];
            setActiveImage((prev) => prev !== targetImage ? targetImage : prev);
          });

          const raf = (time) => {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
          };
          frameId = requestAnimationFrame(raf);
        }
      }, 50);

      return () => {
        if (frameId) cancelAnimationFrame(frameId);
        if (lenis) lenis.destroy();
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      setActiveImage(null);
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
      
      // Resume global scrolling when overlay closes
      if (globalLenis) globalLenis.start();
    }
    
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (globalLenis) globalLenis.start();
    };
  }, [selectedProject, globalLenis]);

  return (
    <>
      <section id="projects" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <BlurText
            text="Selected Works"
            stagger={0.15}
            className="text-4xl md:text-5xl font-serif italic mb-4 justify-center"
          />
          <BlurText
            text="A collection of projects showcasing my expertise in modern web technologies and UI/UX design."
            delay={0.2}
            stagger={0.03}
            className="text-muted-foreground max-w-2xl mx-auto justify-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onClick={(p) => {
                setSelectedProject(p);
                sendGAEvent('event', 'Project_Opened', { value: p.title });
              }} 
            />
          ))}
        </div>
      </section>

      {/* Full Screen Overlay Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="project-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            className="fixed inset-0 z-[100] pointer-events-auto"
          >
            {/* Native DOM Scroll Wrapper explicitly defined for Vanilla Lenis */}
            <div 
               ref={overlayRef} 
               className="w-full h-full overflow-y-auto absolute inset-0 z-50 pointer-events-auto bg-background scrollbar-none"
            >
              {/* Dummy Track: Lenis only applies transform translations to this element on desktop. */}
              <div 
                ref={contentRef}
                style={{ height: `calc(100vh + ${Math.max(0, (selectedProject.gallery?.length || 1) - 1) * 116}px)` }} 
                className="hidden lg:block w-full absolute top-0 left-0 pointer-events-none" 
              />

              {/* VISUAL UI: Native scrolling on mobile, position fixed on desktop */}
              <div className="relative lg:fixed inset-0 w-full min-h-screen lg:h-screen pointer-events-auto z-10">
                
                {/* Back Button */}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0, transition: { duration: 0.2 } }} 
                  transition={{ duration: 0.3 }}
                  className="fixed top-6 left-6 md:top-12 md:left-12 z-[100] pointer-events-auto bg-white/70 dark:bg-black/50 backdrop-blur-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.5)] rounded-full border border-black/10 dark:border-white/20"
                  style={{ WebkitBackdropFilter: "blur(24px)" }}
                >
                  <button 
                    onClick={() => setSelectedProject(null)} 
                    className="flex items-center gap-2 text-foreground uppercase tracking-widest text-xs md:text-sm font-bold transition-transform hover:scale-105 px-5 py-2.5 w-full h-full"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                </motion.div>
                  
                {/* Responsive Layout Engine */}
                <div className="relative w-full h-full px-6 py-24 lg:py-0 md:px-16 lg:px-24 flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-center">
                  
                  {/* Left Side: Info */}
                  <div className="flex-1 flex flex-col gap-6 relative pointer-events-auto z-50">
                <motion.h2 
                  layoutId={`title-${selectedProject.id}`}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl font-bold tracking-tighter"
                >
                  {selectedProject.title}
                </motion.h2>
                
                <motion.div exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                  <BlurText
                    text={selectedProject.subtitle}
                    delay={1.3}
                    stagger={0.05}
                    animateOnMount={true}
                    className="text-primary font-bold tracking-wider uppercase text-lg"
                  />
                </motion.div>

                <motion.div exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                  <BlurText
                    text={selectedProject.description}
                    delay={1.4}
                    stagger={0.03}
                    animateOnMount={true}
                    className="text-xl text-muted-foreground leading-relaxed mt-4"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 uppercase tracking-widest text-xs font-bold border border-foreground/10 rounded-full">
                      {tag}
                    </span>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                  className="flex gap-4 mt-8"
                >
                  {selectedProject.link && selectedProject.link !== "#" && (
                    <LinkPreview 
                      url={selectedProject.link} 
                      className="flex items-center gap-2 px-6 py-3 bg-foreground !text-background rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl"
                    >
                      Visit Site <ExternalLink size={16} />
                    </LinkPreview>
                  )}
                </motion.div>
              </div>
              
              {/* Right Side: Split Gallery (Thumbnails + Main 3D Card) */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="flex-[1.5] flex flex-col lg:flex-row gap-8 w-full h-full pointer-events-none"
              >
                    {/* Middle Column: Locked Scrubbable Carousel (Desktop Only) */}
                    <div className="hidden lg:flex w-[140px] shrink-0 h-full relative items-center justify-center pointer-events-none">
                       
                       {/* Pinned Translation Track */}
                       <motion.div 
                         className="flex flex-col gap-4 absolute top-1/2 left-0 w-full pointer-events-auto"
                         style={{ y: trackY }}
                       >
                         {selectedProject.gallery?.map((img, idx) => {
                           const activeIdx = selectedProject.gallery.indexOf(activeImage);
                           const distance = activeIdx !== -1 ? Math.abs(activeIdx - idx) : 0;
                           return (
                             <ScrollThumbnail key={idx} img={img} activeImage={activeImage} setActiveImage={setActiveImage} distance={distance} isMobile={false} />
                           );
                         })}
                       </motion.div>
                    </div>
                    
                    {/* Horizontal Thumbnails (Mobile Only) */}
                    <div className="flex lg:hidden flex-col gap-2 pointer-events-auto z-50 order-2 lg:order-none w-full">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground px-2">
                        <span>Gallery</span>
                        <span className="animate-pulse">Auto-scrolling</span>
                      </div>
                      <div className="relative w-full">
                        <div ref={thumbScrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                          {selectedProject.gallery?.map((img, idx) => (
                            <div key={idx} className="snap-center shrink-0">
                              <ScrollThumbnail img={img} activeImage={activeImage} setActiveImage={setActiveImage} isMobile={true} />
                            </div>
                          ))}
                        </div>
                        {/* Right Fade Indicator */}
                        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* Far Right Column: 3D Tilt Card Main Stage */}
                    <div className="flex-1 relative h-full flex items-center justify-center pointer-events-auto z-50 order-1 lg:order-none">
                       <TiltCard image={activeImage} />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
