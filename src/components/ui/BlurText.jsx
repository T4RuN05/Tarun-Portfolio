"use client";

import { motion } from "framer-motion";

export function BlurText({
  text,
  className = "",
  delay = 0,
  duration = 1.2,
  stagger = 0.08,
  animateOnMount = false,
  splitBy = "word",
  as: Component = "p",
  disableAnimation = false,
}) {
  const elements = splitBy === "character" ? text.split("") : text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration,
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={disableAnimation ? undefined : container}
      initial={disableAnimation ? undefined : "hidden"}
      animate={disableAnimation ? undefined : (animateOnMount ? "visible" : undefined)}
      whileInView={disableAnimation ? undefined : (!animateOnMount ? "visible" : undefined)}
      viewport={{ once: true, margin: "-50px" }}
      className={`flex flex-wrap ${className}`}
    >
      {elements.map((element, index) => (
        <motion.span 
          variants={disableAnimation ? undefined : child} 
          key={`${element}-${index}`} 
          className={splitBy === "word" ? "mr-[0.25em]" : ""}
        >
          {element === " " ? "\u00A0" : element}
        </motion.span>
      ))}
    </motion.div>
  );
}
