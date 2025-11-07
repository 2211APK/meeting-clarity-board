import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  onClick: () => void;
  label?: string;
};

export function FabButton({ onClick, label = "Summarize Notes" }: Props) {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Button
        onClick={onClick}
        className="group relative cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold shadow-xl"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 via-primary/20 to-purple-500/20 blur-md" />
        <div className="relative flex items-center gap-2 px-5 py-3">
          <Sparkles className="h-4 w-4 text-primary group-hover:animate-pulse" />
          <span>{label}</span>
        </div>
      </Button>
    </motion.div>
  );
}
