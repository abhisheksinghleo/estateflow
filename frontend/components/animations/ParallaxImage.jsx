"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ParallaxImage({
  src,
  alt,
  className = "",
  scale = 1.15,
  speed = 0.3,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ scale }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </motion.div>
  );
}
