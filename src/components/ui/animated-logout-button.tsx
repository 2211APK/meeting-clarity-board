"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedLogoutButtonProps {
  onClick: () => void;
  variant?: "light" | "dark";
  text?: string;
}

export function AnimatedLogoutButton({
  onClick,
  variant = "dark",
  text = "Log Out",
}: AnimatedLogoutButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [isDoorSlammed, setIsDoorSlammed] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    
    setTimeout(() => {
      setIsDoorSlammed(true);
    }, 100);
    
    setTimeout(() => {
      setIsFalling(true);
    }, 200);
    
    setTimeout(() => {
      onClick();
    }, 800);
  };

  const buttonClasses = `
    relative h-10 w-[130px] cursor-pointer border-0 bg-transparent 
    px-0 pl-5 text-left text-sm font-medium outline-none
    ${variant === "light" ? "text-foreground" : "text-background"}
    ${isClicked ? "clicked" : ""}
    ${isDoorSlammed ? "door-slammed" : ""}
    ${isFalling ? "falling" : ""}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      style={{ perspective: "100px" }}
    >
      <span
        className={`absolute left-0 top-0 z-[2] block h-full w-full rounded-md transition-transform duration-50 ease-in-out
          ${variant === "light" ? "bg-background" : "bg-card"}
          ${isClicked ? "" : "hover:scale-[0.98]"}
        `}
      />
      
      <span className="relative z-10 font-medium">
        {text}
      </span>

      {/* Figure SVG */}
      <svg
        className={`absolute bottom-[5px] right-[18px] z-[4] w-[30px] transition-all duration-100
          ${isFalling ? "animate-spin opacity-0 -bottom-[1080px] right-[1px]" : ""}
        `}
        viewBox="0 0 140 140"
        fill="none"
      >
        <g className="figure">
          <path
            className="arm1"
            d="M73.5 51.5L75.5 48L77 54.5L75.5 58.5L73.5 51.5Z"
            fill="currentColor"
          />
          <path
            className="wrist1"
            d="M77 54.5L80.5 52.5L82.5 56L78.5 58.5L77 54.5Z"
            fill="currentColor"
          />
          <path
            className="arm2"
            d="M66.5 51L64.5 47.5L63 54L64.5 58L66.5 51Z"
            fill="currentColor"
          />
          <path
            className="wrist2"
            d="M63 54L59.5 52L57.5 55.5L61.5 58L63 54Z"
            fill="currentColor"
          />
          <ellipse cx="70" cy="50" rx="11" ry="11" fill="currentColor" />
          <path
            d="M70 61C70 61 65 63 65 68V85H75V68C75 63 70 61 70 61Z"
            fill="currentColor"
          />
          <path
            className="leg1"
            d="M75 85L77 95L75 100L73 90L75 85Z"
            fill="currentColor"
          />
          <path
            className="calf1"
            d="M75 100L77 110L75 115L73 105L75 100Z"
            fill="currentColor"
          />
          <path
            className="leg2"
            d="M65 85L63 95L65 100L67 90L65 85Z"
            fill="currentColor"
          />
          <path
            className="calf2"
            d="M65 100L63 110L65 115L67 105L65 100Z"
            fill="currentColor"
          />
        </g>
      </svg>

      {/* Door SVG */}
      <svg
        className={`absolute bottom-[4px] right-[12px] z-[5] w-[32px] transition-transform duration-200 ease-in-out`}
        style={{
          transformOrigin: "100% 50%",
          transformStyle: "preserve-3d",
          transform: isDoorSlammed ? "rotateY(0deg)" : isClicked ? "rotateY(35deg)" : undefined,
        }}
        viewBox="0 0 32 40"
        fill="none"
      >
        <path
          className="door"
          d="M0 0H32V40H0V0Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="4"
        />
        <circle cx="24" cy="20" r="2" fill={variant === "light" ? "#1f2335" : "#f4f7ff"} />
      </svg>

      {/* Doorway SVG */}
      <svg
        className="absolute bottom-[4px] right-[12px] z-[3] w-[32px]"
        viewBox="0 0 32 40"
        fill="none"
      >
        <path
          className="doorway"
          d="M0 0H32V40H0V0Z"
          fill={variant === "light" ? "#1f2335" : "#f4f7ff"}
        />
      </svg>

      {/* Bang effect */}
      {isFalling && (
        <motion.div
          className="absolute inset-0 rounded-md bg-white"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
}