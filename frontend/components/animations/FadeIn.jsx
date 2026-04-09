"use client";

import { motion, useReducedMotion } from "framer-motion";

const directionOffsets = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
};

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}) {
  const shouldReduceMotion = useReducedMotion();
  const offset = directionOffsets[direction] || directionOffsets.up;

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, ...offset }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        type: "spring",
        bounce: 0.15,
        duration,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
