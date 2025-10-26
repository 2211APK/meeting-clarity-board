"use client";

import { motion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 h-1 bg-primary origin-left z-50",
        className
      )}
      style={{ scaleX: scrollYProgress }}
    />
  );
}
