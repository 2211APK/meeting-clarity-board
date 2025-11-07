import { useMemo } from "react";
import { BoardToolbar } from "./BoardToolbar";
import { BoardCard } from "./BoardCard";
import { FreeCard, CardType } from "@/types/board";
import { motion } from "framer-motion";

type Props = {
  cards: FreeCard[];
  setCards: (cards: FreeCard[]) => void;
  zoom: number;
  setZoom: (z: number) => void;
  onThemeToggle: () => void;
  isDark: boolean;
};

const gridSize = 24;

export function BoardContainer({
  cards,
  setCards,
  zoom,
  setZoom,
  onThemeToggle,
  isDark,
}: Props) {
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `
        radial-gradient(1200px 500px at 80% -10%, ${isDark ? "rgba(33, 74, 170, 0.25)" : "rgba(135, 206, 235, 0.25)"} 0%, transparent 60%),
        radial-gradient(800px 600px at 10% 110%, ${isDark ? "rgba(0, 131, 255, 0.25)" : "rgba(173, 216, 230, 0.25)"} 0%, transparent 60%),
        linear-gradient(${isDark ? "180deg, rgba(10,16,30,0.85), rgba(8,15,28,0.85)" : "180deg, rgba(255,255,255,0.85), rgba(240,245,255,0.85)"}),
        linear-gradient(
          to bottom,
          transparent 0,
          transparent calc(100% - 1px),
          rgba(255,255,255,0.06) calc(100% - 1px)
        )
      `,
      backgroundSize: `
        auto,
        auto,
        auto,
        ${gridSize}px ${gridSize}px
      `,
    }),
    [isDark],
  );

  const onAdd = () => {
    const newCard: FreeCard = {
      id: `free-${Date.now()}`,
      content: "New note…",
      type: "todo",
      x: 48,
      y: 48,
      w: 280,
      h: 180,
    };
    setCards([newCard, ...cards]);
  };

  const onAutoOrganize = () => {
    const cols = Math.max(1, Math.floor((window.innerWidth - 200) / 320));
    const organized = cards.map((c, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 48 + col * 320;
      const y = 120 + row * 240;
      return { ...c, x, y };
    });
    setCards(organized);
  };

  const onZoomIn = () => setZoom(Math.min(1.6, zoom + 0.1));
  const onZoomOut = () => setZoom(Math.max(0.6, zoom - 0.1));
  const onReset = () => {
    setZoom(1);
    onAutoOrganize();
  };

  const handleChange = (id: string, patch: Partial<FreeCard>) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const handleDelete = (id: string) => setCards(cards.filter((c) => c.id !== id));

  return (
    <>
      <BoardToolbar
        onAdd={onAdd}
        onAutoOrganize={onAutoOrganize}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onReset}
        onThemeToggle={onThemeToggle}
        isDark={isDark}
      />
      <div className="relative w-full min-h-[140vh] overflow-visible">
        <motion.div
          className="relative mx-auto max-w-[1600px] min-h-[120vh] rounded-3xl border border-white/10 backdrop-blur-xl"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            ...backgroundStyle,
          }}
        >
          {cards.map((card) => (
            <BoardCard
              key={card.id}
              card={card}
              onChange={handleChange}
              onDelete={handleDelete}
              gridSize={gridSize}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
}
