import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { LightRays } from "@/components/ui/light-rays";
import { Button, LiquidButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Brain, Zap, Layout, ArrowRight, Sun, Moon, Clock, Shield, Users } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import DisplayCards from "@/components/DisplayCards";
import { ContainerScroll } from "@/components/ContainerScroll";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import VaporizeTextCycle, { Tag } from "@/components/VaporizeTextCycle";
import { Logos } from "@/components/Logos";
import { HandWrittenTitle } from "@/components/HandWrittenTitle";
import { Timeline } from "@/components/Timeline";
import { Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter } from "@/components/ui/modal";
import { BackgroundPaths } from "@/components/BackgroundPaths";
import { TextLoop } from "@/components/ui/text-loop";
import { TextScramble } from "@/components/ui/text-scramble";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Input } from "@/components/ui/input";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Minimal landing redesign (blank white canvas with centered hero)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1
          className="text-5xl md:text-6xl font-bold text-black"
          style={{ fontFamily: "'Sans Forgetica', sans-serif" }}
        >
          Nulsify
        </h1>
        <p className="text-muted-foreground text-lg">
          Turn meeting chaos into crystal clear action.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            disabled={isLoading}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}