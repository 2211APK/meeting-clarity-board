import { useAuth } from "@/hooks/use-auth";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader } from "@/components/ui/loader";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CardType } from "@/types/board";

export default function ProcessNotes() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(8);
  
  // Add results & UI state
  const [resultCards, setResultCards] = useState<Array<{ id: string; content: string; type: CardType }>>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const notes = location.state?.notes || "";
  const noteTitle = location.state?.noteTitle || "";
  
  const extractMeetingNotes = useAction(api.ai.extractMeetingNotes as any);

  // Normalize incoming types to our categories
  const normalizeType = (t: string): CardType => {
    const s = (t || "").toLowerCase();
    if (s.includes("decision") || s.includes("high")) return "high_importance";
    if (s.includes("action") || s.includes("todo") || s.includes("task")) return "todo";
    if (s.includes("question") || s.includes("?")) return "questions";
    if (s.includes("people") || s.includes("owner") || s.includes("assignee") || s.includes("assigned")) return "people";
    if (s.includes("follow")) return "follow_up";
    return "todo";
  };

  // Copy and save helpers
  const byType = (arr: Array<{ id: string; content: string; type: CardType }>, type: CardType) =>
    arr.filter((c) => c.type === type);

  const handleExport = () => {
    const cards = resultCards;
    const high = byType(cards, "high_importance");
    const todos = byType(cards, "todo");
    const people = byType(cards, "people");
    const questions = byType(cards, "questions");
    const followUps = byType(cards, "follow_up");

    let output = "";
    if (high.length) {
      output += "DECISIONS (High Importance):\n";
      high.forEach((d) => (output += `• ${d.content}\n`));
      output += "\n";
    }
    const allActions = [...todos, ...followUps];
    if (allActions.length) {
      output += "ACTION ITEMS:\n";
      allActions.forEach((a) => (output += `• ${a.content}\n`));
      output += "\n";
    }
    if (people.length) {
      output += "PEOPLE / OWNERSHIP:\n";
      people.forEach((p) => (output += `• ${p.content}\n`));
      output += "\n";
    }
    if (questions.length) {
      output += "OPEN QUESTIONS:\n";
      questions.forEach((q) => (output += `• ${q.content}\n`));
    }

    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveNote = useMutation(api.notes.saveNote);
  const mapToLegacyType = (t: CardType): "decision" | "action" | "question" => {
    if (t === "high_importance") return "decision";
    if (t === "questions") return "question";
    return "action";
  };

  const handleSaveNote = async () => {
    if (!noteTitle?.trim()) {
      toast.error("Please enter a title for your note on the Dashboard first.");
      return;
    }
    if (resultCards.length === 0) {
      toast.error("No summarized items to save.");
      return;
    }
    try {
      const legacyCards = resultCards.map((c) => ({
        id: c.id,
        content: c.content,
        type: mapToLegacyType(c.type),
      }));
      await saveNote({ title: noteTitle, content: notes, cards: legacyCards });
      toast.success("Note saved successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save note");
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    // Smoothly ramp progress towards 90% until navigation happens
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        const inc = p < 40 ? 8 : p < 70 ? 5 : 2;
        return Math.min(90, p + inc);
      });
    }, 350);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!notes) {
      navigate("/dashboard");
      return;
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    const processNotes = async () => {
      try {
        const extracted = await extractMeetingNotes({ notes });
        setProgress(100);

        // Show results here (separate from the Dashboard input)
        const mapped = (extracted as Array<{ id: string; content: string; type?: string }>).map((c, i) => ({
          id: c.id ?? `card-${i}`,
          content: c.content,
          type: normalizeType(c.type || ""),
        }));
        setTimeout(() => setResultCards(mapped), 400);
      } catch (error) {
        console.error("Error processing notes:", error);
        const errorCode =
          (error as any)?.data?.code ??
          (error as any)?.code ??
          (error as any)?.response?.status ??
          (error as any)?.name ??
          "UNKNOWN";
        const errorMessage =
          (error as any)?.data?.message ??
          (error as any)?.message ??
          "Failed to process notes";

        setProgress(100);
        setErrorMsg(`${errorMessage} (Code: ${String(errorCode)})`);
      }
    };

    processNotes();

    return () => clearInterval(progressInterval);
  }, [notes, noteTitle, extractMeetingNotes, navigate]);

  return (
    <>
      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] px-0 py-0">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          {/* Loading Card (only when no results and no error) */}
          {resultCards.length === 0 && !errorMsg && (
            <Card className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/20 p-12">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-16 w-16 text-primary" />
                </motion.div>
                
                <Loader />
                
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    AI is Analyzing Your Notes
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Extracting decisions, action items, and questions...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {Math.round(progress)}% complete
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-xs text-muted-foreground">Decisions</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-xs text-muted-foreground">Actions</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-2xl mb-2">❓</div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </motion.div>
                </div>
              </div>
            </Card>
          )}

          {/* Error State */}
          {errorMsg && (
            <Card className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/20 p-10">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Processing Failed</h2>
                <p className="text-muted-foreground">{errorMsg}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Results Summary */}
          {resultCards.length > 0 && (
            <Card className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/20 p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Summarized Notes</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Organized into key categories
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExport}>
                    {copied ? "Copied!" : "Copy Summary"}
                  </Button>
                  <Button variant="default" onClick={handleSaveNote}>
                    Save Note
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                <SummaryColumn title="📝 To Do" items={resultCards.filter((c) => c.type === "todo")} />
                <SummaryColumn title="👥 People Involved" items={resultCards.filter((c) => c.type === "people")} />
                <SummaryColumn title="🔁 Follow-ups" items={resultCards.filter((c) => c.type === "follow_up")} />
                <SummaryColumn title="🔥 High Importance" items={resultCards.filter((c) => c.type === "high_importance")} />
                <SummaryColumn title="❓ Questions" items={resultCards.filter((c) => c.type === "questions")} />
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
}

function SummaryColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; content: string }>;
}) {
  return (
    <div className="backdrop-blur-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-4 rounded-xl min-h-[160px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-xs text-muted-foreground">No items</div>
        ) : (
          items.slice(0, 8).map((i) => (
            <div
              key={i.id}
              className="text-sm rounded-md border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 px-3 py-2"
            >
              {i.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}