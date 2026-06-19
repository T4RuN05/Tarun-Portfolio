"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Layout, Server, Database, PenTool, ArrowRight } from "lucide-react";
import { BlurText } from "@/components/ui/BlurText";
import { 
  SiJavascript, SiReact, SiNextdotjs, SiThreedotjs, SiFramer, SiTailwindcss, 
  SiCplusplus, SiNodedotjs, SiExpress, SiPython, 
  SiPostgresql, SiMongodb, SiDocker, 
  SiFigma, SiGit, SiVercel 
} from "react-icons/si";

const skillDomains = [
  {
    id: "frontend",
    title: "Frontend / Creative Dev",
    icon: <Layout className="w-5 h-5 md:w-6 md:h-6" />,
    description: "Crafting immersive, high-performance web experiences.",
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "" },
      { name: "Three.js", icon: SiThreedotjs, color: "" },
      { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
      { name: "TailwindCSS", icon: SiTailwindcss, color: "#06B6D4" },
    ]
  },
  {
    id: "backend",
    title: "Backend / Core Logic",
    icon: <Server className="w-5 h-5 md:w-6 md:h-6" />,
    description: "Building scalable and robust server-side architectures.",
    skills: [
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express JS", icon: SiExpress, color: "" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
    ]
  },
  {
    id: "database",
    title: "Databases & Architecture",
    icon: <Database className="w-5 h-5 md:w-6 md:h-6" />,
    description: "Designing efficient data models and deployment pipelines.",
    skills: [
      { name: "SQL", icon: Database, color: "#00758F" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
    ]
  },
  {
    id: "design",
    title: "UI/UX & Tools",
    icon: <PenTool className="w-5 h-5 md:w-6 md:h-6" />,
    description: "Designing intuitive interfaces and managing project workflows.",
    skills: [
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Vercel", icon: SiVercel, color: "" },
    ]
  }
];

export function Skills() {
  const [activeDomain, setActiveDomain] = useState(skillDomains[0]);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="skills" ref={containerRef} className="relative min-h-screen py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container px-6 md:px-12 mx-auto max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
            <BlurText
              text="Technical Arsenal"
              stagger={0.15}
              className="text-4xl md:text-5xl font-serif italic mb-4"
            />
            <BlurText
              text="The frameworks, languages, and tools I use to build scalable digital experiences."
              delay={0.2}
              stagger={0.03}
              className="text-muted-foreground max-w-2xl text-lg"
            />
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 min-h-[400px]">
          
          {/* Left Column: Domains List */}
          <div className="flex flex-col gap-4">
            {skillDomains.map((domain, idx) => {
              const isActive = activeDomain.id === domain.id;
              
              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onMouseEnter={() => setActiveDomain(domain)}
                  onClick={() => setActiveDomain(domain)}
                  className={`gpu-accelerate group relative p-6 md:p-8 rounded-3xl cursor-pointer select-none touch-manipulation transition-all duration-500 overflow-hidden ${
                    isActive 
                      ? "glass backdrop-blur-lg shadow-2xl scale-[1.02]" 
                      : "hover:bg-white/30 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/5"
                  }`}
                >
                  {/* Subtle active background glow */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-domain-bg"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-start gap-4 md:gap-6 w-full">
                      <div className={`p-3 rounded-2xl transition-colors duration-500 shrink-0 ${
                        isActive ? "bg-primary text-background" : "bg-background/50 text-foreground group-hover:bg-secondary"
                      }`}>
                        {domain.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}>
                          {domain.title}
                        </h3>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-muted-foreground max-w-sm mb-4 lg:mb-0">
                                {domain.description}
                              </p>
                              
                              {/* Mobile Only: Inline Skills Accordion */}
                              <div className="lg:hidden flex flex-wrap gap-2 mt-4">
                                {domain.skills.map((skill, idx) => {
                                  const Icon = skill.icon;
                                  return (
                                    <motion.div
                                      key={skill.name}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: idx * 0.05 }}
                                      className="flex items-center gap-2 p-2 px-3 rounded-xl bg-background/40 border border-white/5 shadow-sm backdrop-blur-md"
                                    >
                                      <Icon className="w-4 h-4 md:w-5 md:h-5" style={skill.color ? { color: skill.color } : undefined} />
                                      <span className="text-xs font-semibold text-foreground whitespace-nowrap">{skill.name}</span>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Active Indicator Arrow */}
                    <motion.div 
                      animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="hidden md:block text-primary"
                    >
                      <ArrowRight size={24} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Floating Skills Container (Desktop Only) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex relative items-center justify-center"
          >
             <div className="w-full h-full min-h-[400px] p-8 md:p-12 rounded-[2.5rem] bg-secondary/20 border border-white/5 backdrop-blur-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                
                {/* Background ambient color tied to active domain (optional, subtle) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />

                <AnimatePresence mode="wait">
                  {isInView && (
                    <motion.div
                      key={activeDomain.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, staggerChildren: 0.1 }}
                    className="relative z-10 w-full flex flex-wrap justify-center gap-4 md:gap-6"
                  >
                    {activeDomain.skills.map((skill, idx) => {
                      const Icon = skill.icon;
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 200, 
                            damping: 15,
                            delay: idx * 0.05 
                          }}
                          whileHover={{ y: -5, scale: 1.05 }}
                          className="flex flex-col items-center gap-3 p-4 w-[100px] md:w-[120px] rounded-2xl bg-background/40 hover:bg-background/80 border border-white/5 transition-colors cursor-default shadow-lg backdrop-blur-md"
                        >
                          <Icon className="w-10 h-10 md:w-12 md:h-12" style={skill.color ? { color: skill.color } : undefined} />
                          <span className="text-xs md:text-sm font-semibold text-center text-foreground">{skill.name}</span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                    )}
                  </AnimatePresence>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
