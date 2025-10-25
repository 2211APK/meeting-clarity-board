"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LayoutTextFlipProps {
  text: string;
  words: string[];
  className?: string;
}

export function LayoutTextFlip({ text, words, className = "" }: LayoutTextFlipProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-2xl font-bold text-foreground">{text}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWordIndex}
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: -90 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-primary"
          style={{ transformStyle: "preserve-3d" }}
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
