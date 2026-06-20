"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sendGAEvent } from '@next/third-parties/google';

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = (e) => {
    const isDark = theme === "dark";
    const newTheme = isDark ? "light" : "dark";

    // Fallback if browser doesn't support View Transitions
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Get click coordinates to start the ripple from the mouse
    const x = e.clientX;
    const y = e.clientY;
    
    // Calculate the distance to the furthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ],
        },
        {
          duration: 600,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <>
      <motion.header
      initial={{ width: "100%", top: "0px", borderRadius: "0px" }}
      animate={{ 
        width: scrolled ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "90%" : "820px") : "100%",
        top: scrolled ? "16px" : "0px",
        borderRadius: scrolled ? "9999px" : "0px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 transition-colors duration-300",
        scrolled ? "py-3 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]" : "py-6 bg-transparent"
      )}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.8, ease: "easeOut" }}
        className="text-2xl font-bold tracking-wider relative z-10 shrink-0"
      >
        <a href="#home">Tarun.</a>
      </motion.div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 relative z-10">
        {navLinks.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.href}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
            className="text-sm font-medium hover:text-primary/70 transition-colors relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
          </motion.a>
        ))}
        {mounted && (
          <motion.a
            href="/Tarun_Asthana_Resume.pdf"
            download="Tarun_Asthana_Resume.pdf"
            onClick={() => sendGAEvent({ event: 'Resume_Downloaded', value: 'navbar_desktop' })}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3 + navLinks.length * 0.1, duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors bg-secondary/50 hover:bg-secondary/80 px-4 py-2.5 rounded-full border border-white/10 shadow-md ml-2"
          >
            <Download size={14} />
            <span>Resume</span>
          </motion.a>
        )}
        {mounted && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3 + navLinks.length * 0.1, duration: 0.8, ease: "easeOut" }}
            onClick={handleThemeToggle}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary/80 transition-colors glass overflow-hidden"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="absolute"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-4 relative z-10">
        {mounted && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.8, ease: "easeOut" }}
            onClick={handleThemeToggle}
            className="relative flex items-center justify-center w-9 h-9 rounded-full glass overflow-hidden"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="absolute"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        )}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 0.8, ease: "easeOut" }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full glass"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      </motion.header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-[5%] right-[5%] w-[90%] bg-white/10 dark:bg-black/40 backdrop-blur-md flex flex-col items-center py-6 gap-6 md:hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 rounded-3xl z-40"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/Tarun_Asthana_Resume.pdf"
              download="Tarun_Asthana_Resume.pdf"
              onClick={() => { setIsOpen(false); sendGAEvent({ event: 'Resume_Downloaded', value: 'navbar_mobile' }); }}
              className="mt-4 text-lg font-medium text-primary flex items-center gap-2 glass px-6 py-3 rounded-full"
            >
              <Download size={18} /> Download Resume
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
