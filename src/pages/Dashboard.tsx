import { useAuth } from "@/hooks/use-auth";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { Home, FileText, Settings, Sun, Moon, Sparkles, Check, Copy } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { FabButton } from "@/components/layout/FabButton";
import { BoardContainer } from "@/components/board/BoardContainer";
import type { FreeCard, CardType } from "@/types/board";

// Local type for input mode list items
type NoteCard = {
  id: string;
  content: string;
  type: CardType;
};

const EXAMPLE_NOTES = `Meeting Notes - Product Roadmap Discussion (Jan 15, 2024)

Attendees: Sarah, Mike, Jessica, Tom

We decided to move forward with the mobile app redesign for Q1. The team agreed that user feedback has been consistently pointing to navigation issues.

ACTION: Mike will create wireframes by next Friday and share them with the design team.

Should we consider adding dark mode in this release or push it to Q2?

Final decision: We're going with the new color palette that Jessica proposed. It tested better with our target demographic.

TODO: Sarah needs to schedule user testing sessions for the new prototype by end of month.

Question: Do we have budget approval for the additional developer resources?

Tom will reach out to the engineering team about technical feasibility by Wednesday.

We agreed that the launch date will be March 15th, pending no major blockers.

Need to figure out: What's our rollback plan if we encounter critical bugs post-launch?

ACTION: Jessica will draft the marketing timeline and coordinate with the content team.`;

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h1
        className="text-4xl font-bold text-black"
        style={{ fontFamily: "'Sans Forgetica', sans-serif" }}
      >
        Nulsify
      </h1>
    </div>
  );
}