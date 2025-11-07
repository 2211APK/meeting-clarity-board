import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, ZoomIn, ZoomOut, RotateCcw, Moon, Sun } from "lucide-react";

type Props = {
  onAdd: () => void;
  onAutoOrganize: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onThemeToggle: () => void;
  isDark: boolean;
};

export function BoardToolbar({
  onAdd,
  onAutoOrganize,
  onZoomIn,
  onZoomOut,
  onReset,
  onThemeToggle,
  isDark,
}: Props) {
  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="backdrop-blur-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-full shadow-2xl px-2 py-1 flex items-center gap-1">
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onAutoOrganize}>
          <Grid3X3 className="h-4 w-4 mr-1" /> Auto-Organize
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onThemeToggle}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
}
