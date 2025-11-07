import { FreeCard } from "@/types/board";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  card: FreeCard;
  onChange: (cardId: string, patch: Partial<FreeCard>) => void;
  onDelete: (cardId: string) => void;
  gridSize?: number;
};

export function BoardCard({ card, onChange, onDelete, gridSize = 24 }: Props) {
  const [local, setLocal] = useState({ x: card.x, y: card.y });

  const snap = (value: number) => Math.round(value / gridSize) * gridSize;

  return (
    <motion.div
      drag
      dragMomentum
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        const newX = snap(local.x + info.offset.x);
        const newY = snap(local.y + info.offset.y);
        onChange(card.id, { x: newX, y: newY });
        setLocal({ x: newX, y: newY });
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      whileDrag={{ scale: 1.05, rotate: 0.5, boxShadow: "0 25px 60px rgba(0,0,0,0.35)" }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="absolute rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10"
      style={{
        left: card.x,
        top: card.y,
        width: card.w,
        height: card.h,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
      }}
    >
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={() => onDelete(card.id)}
          className="size-7 rounded-full bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/10 grid place-items-center hover:scale-105 transition"
          aria-label="Delete"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3 pt-10 h-full">
        <div className="text-xs font-semibold opacity-70 mb-2">
          {renderType(card.type)}
        </div>
        <textarea
          defaultValue={card.content}
          onBlur={(e) => onChange(card.id, { content: e.target.value })}
          className="w-full h-[calc(100%-2.5rem)] bg-transparent resize rounded-md focus:outline-none text-foreground/90"
          placeholder="Write here..."
        />
      </div>
    </motion.div>
  );
}

function renderType(t: FreeCard["type"]) {
  switch (t) {
    case "high_importance":
      return "🔥 High Importance";
    case "todo":
      return "📝 To Do";
    case "people":
      return "👥 People";
    case "questions":
      return "❓ Questions";
    case "follow_up":
      return "🔁 Follow-up";
    default:
      return "Card";
  }
}
