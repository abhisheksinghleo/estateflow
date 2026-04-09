"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Parse numeric value from target string (handles "12,480+", "85+", "< 2 hrs")
    const numericString = String(target).replace(/[^0-9.]/g, "");
    const end = parseFloat(numericString) || 0;

    if (shouldReduceMotion || end === 0) {
      setCount(end);
      return;
    }

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic for a decelerating feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, duration, shouldReduceMotion]);

  // Format with commas
  const formatted = count.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
