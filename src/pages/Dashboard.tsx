import { useAuth } from "@/hooks/use-auth";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { Loader2, Copy, Check, Sparkles, Home, FileText, Settings, Sun, Moon } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { GradientButton } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { FabButton } from "@/components/layout/FabButton";
import { BoardContainer } from "@/components/board/BoardContainer";
import type { FreeCard, CardType } from "@/types/board";

/* removed duplicate local CardType; using imported CardType from @/types/board */

interface NoteCard {
  id: string;
  content: string;
  type: CardType;
}

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
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState(EXAMPLE_NOTES);
  const [cards, setCards] = useState<NoteCard[]>([]);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [noteTitle, setNoteTitle] = useState("");
  const [freeCards, setFreeCards] = useState<FreeCard[]>([]);
  const [zoom, setZoom] = useState(1);
  // Add a ref to ensure single toast handling per navigation (avoids StrictMode double effects)
  const handledNavigationRef = useRef(false);

  const saveNote = useMutation(api.notes.saveNote);
  const userNotes = useQuery(api.notes.getUserNotes);

  // Normalize incoming card types from AI / legacy into new categories
  const normalizeType = (t: string): CardType => {
    const s = (t || "").toLowerCase();
    if (s.includes("decision") || s.includes("high")) return "high_importance";
    if (s.includes("action") || s.includes("todo") || s.includes("task")) return "todo";
    if (s.includes("question") || s.includes("?")) return "questions";
    if (s.includes("people") || s.includes("owner") || s.includes("assignee") || s.includes("assigned")) return "people";
    if (s.includes("follow")) return "follow_up";
    return "todo";
  };

  // Adjust incoming results from ProcessNotes page with single-toast guard and error code display
  useEffect(() => {
    if (handledNavigationRef.current) return;

    if (location.state?.cards) {
      const mapped = (location.state.cards as Array<{ id: string; content: string; type?: string }>).map((c, i) => ({
        id: c.id ?? `card-${i}`,
        content: c.content,
        type: normalizeType(c.type || ""),
      }));
      setCards(mapped);
      if (location.state.noteTitle) setNoteTitle(location.state.noteTitle as string);
      if (location.state.notes) setNotes(location.state.notes as string);
      toast.success(`AI extracted ${mapped.length} items from your notes`);
      handledNavigationRef.current = true;
      navigate("/dashboard", { replace: true, state: {} });
    } else if (location.state?.error) {
      const errorMessage =
        typeof location.state.error === "string" && location.state.error.trim()
          ? (location.state.error as string)
          : "Failed to process notes";
      const errorCode =
        (location.state as any).errorCode ??
        (location.state as any).code ??
        "UNKNOWN";

      toast.error(
        <div>
          <div>{errorMessage}</div>
          <div className="text-xs opacity-70 mt-1">Code: {String(errorCode)}</div>
        </div>
      );
      handledNavigationRef.current = true;
      navigate("/dashboard", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Update local heuristic extractor to new categories (used for sample/manual)
  const extractCards = (text: string): NoteCard[] => {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const extracted: NoteCard[] = [];
    let id = 0;

    lines.forEach((line) => {
      const t = line.trim();

      // Skip headers/short
      if (t.length < 10 || /^meeting|^attendees/i.test(t)) return;

      // Follow-up
      if (/follow[-\s]?up|follow up/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "follow_up" });
        return;
      }

      // High importance (decisions/finals)
      if (/we decided|final decision|agreed that|we're going with|going with/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "high_importance" });
        return;
      }

      // People (assignments/owners)
      if (/\b([A-Z][a-z]+)\b\s+(will|needs? to|to)\b/i.test(t) || /owner|assignee/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "people" });
        return;
      }

      // To do (actions/tasks)
      if (/TODO:|ACTION:|needs? to|will\s+\w+|by\s+(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|end)/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "todo" });
        return;
      }

      // Questions
      if (t.includes("?") || /should we|question:|what's|how do we/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "questions" });
        return;
      }
    });

    return extracted;
  };

  const extractMeetingNotes = useAction(api.ai.extractMeetingNotes as any);

  const handleProcess = async () => {
    if (!notes.trim()) {
      toast.error("Please enter some notes to process");
      return;
    }
    
    // Navigate to processing page
    navigate("/process-notes", { 
      state: { 
        notes: notes,
        noteTitle: noteTitle 
      } 
    });
  };

  // Map our new categories back to legacy storage categories for backend typing
  const mapToLegacyType = (t: CardType): "decision" | "action" | "question" => {
    if (t === "high_importance") return "decision";
    if (t === "questions") return "question";
    // Collapse todo, people, follow_up into "action" for storage
    return "action";
  };

  // Initialize freeform cards when AI finishes and cards arrive
  useEffect(() => {
    if (cards.length > 0) {
      // Auto place into a grid for first render of board
      const cols = Math.max(1, Math.floor((window.innerWidth - 200) / 320));
      const initial: FreeCard[] = cards.map((c, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 48 + col * 320;
        const y = 120 + row * 240;
        return {
          ...c,
          x,
          y,
          w: 300,
          h: 180,
        };
      });
      setFreeCards(initial);
    }
  }, [cards]);

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }
    const hasAny = (freeCards.length || cards.length) > 0;
    if (!hasAny) {
      toast.error("Please process some notes before saving");
      return;
    }
    try {
      const source = freeCards.length > 0 ? freeCards : cards;
      const legacyCards = source.map((c) => ({
        id: c.id,
        content: c.content,
        type: mapToLegacyType(c.type as CardType),
      }));
      await saveNote({
        title: noteTitle,
        content: notes,
        cards: legacyCards,
      });
      toast.success("Note saved successfully!");
      setNoteTitle("");
    } catch (error) {
      toast.error("Failed to save note");
      console.error(error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceType = result.source.droppableId as CardType;
    const destType = result.destination.droppableId as CardType;

    // Disallow cross-column moves in input mode
    if (sourceType !== destType) return;

    if (result.source.index === result.destination.index) return;

    const newCards = Array.from(cards);
    const sourceCards = newCards.filter((c) => c.type === sourceType);
    const [movedCard] = sourceCards.splice(result.source.index, 1);
    // Insert back to same column different position
    sourceCards.splice(result.destination.index, 0, movedCard);

    // Rebuild final array: keep other types intact, replace this type's ordering
    const others = newCards.filter((c) => c.type !== sourceType);
    setCards([...others, ...sourceCards]);
  };

  const handleExport = () => {
    const high = cards.filter((c) => c.type === "high_importance");
    const todos = cards.filter((c) => c.type === "todo");
    const people = cards.filter((c) => c.type === "people");
    const questions = cards.filter((c) => c.type === "questions");
    const followUps = cards.filter((c) => c.type === "follow_up");

    let output = "";

    if (high.length > 0) {
      output += "DECISIONS (High Importance):\n";
      high.forEach((d) => {
        output += `• ${d.content}\n`;
      });
      output += "\n";
    }

    const allActions = [...todos, ...followUps];
    if (allActions.length > 0) {
      output += "ACTION ITEMS:\n";
      allActions.forEach((a) => {
        output += `• ${a.content}\n`;
      });
      output += "\n";
    }

    if (people.length > 0) {
      output += "PEOPLE / OWNERSHIP:\n";
      people.forEach((p) => {
        output += `• ${p.content}\n`;
      });
      output += "\n";
    }

    if (questions.length > 0) {
      output += "OPEN QUESTIONS:\n";
      questions.forEach((q) => {
        output += `• ${q.content}\n`;
      });
    }

    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getCardsByType = (type: CardType) => cards.filter((c) => c.type === type);

  // Update column configuration and order
  const columnConfig = {
    high_importance: {
      title: "🔥 High Importance",
      bgClass: "bg-red-500/10 border-red-500/30",
      cardBg: "bg-red-500/20 border-red-400/40 hover:bg-red-500/30",
    },
    todo: {
      title: "📝 To Do",
      bgClass: "bg-blue-500/10 border-blue-500/30",
      cardBg: "bg-blue-500/20 border-blue-400/40 hover:bg-blue-500/30",
    },
    people: {
      title: "👥 People",
      bgClass: "bg-purple-500/10 border-purple-500/30",
      cardBg: "bg-purple-500/20 border-purple-400/40 hover:bg-purple-500/30",
    },
    questions: {
      title: "❓ Questions",
      bgClass: "bg-yellow-500/10 border-yellow-500/30",
      cardBg: "bg-yellow-500/20 border-yellow-400/40 hover:bg-yellow-500/30",
    },
    follow_up: {
      title: "🔁 Follow-up",
      bgClass: "bg-emerald-500/10 border-emerald-500/30",
      cardBg: "bg-emerald-500/20 border-emerald-400/40 hover:bg-emerald-500/30",
    },
  } as const;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-visible bg-background">
      {/* Page Backdrop (light / dark) */}
      <div className="absolute inset-0 z-0 dark:hidden">
        <img
          src="https://harmless-tapir-303.convex.cloud/api/storage/026444ea-d6b5-478a-a55b-3f9a42c5430a"
          alt=""
          className="w-full h-full object-cover opacity-90 pointer-events-none select-none"
        />
      </div>
      <div className="absolute inset-0 z-0 hidden dark:block">
        <img
          src="https://harmless-tapir-303.convex.cloud/api/storage/3891c785-c9a0-42e1-8708-2d578244fb9e"
          alt=""
          className="w-full h-full object-cover opacity-90 pointer-events-none select-none"
        />
      </div>

      {/* Top Dock Navigation */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
        <Dock magnification={60} distance={100} className="pointer-events-auto">
          <DockItem>
            <DockLabel>Home</DockLabel>
            <DockIcon>
              <div onClick={() => navigate("/")} className="cursor-pointer">
                <Home className="h-5 w-5" />
              </div>
            </DockIcon>
          </DockItem>
          <DockItem>
            <DockLabel>Dashboard</DockLabel>
            <DockIcon>
              <div className="cursor-pointer">
                <FileText className="h-5 w-5" />
              </div>
            </DockIcon>
          </DockItem>
          <DockItem>
            <DockLabel>Theme</DockLabel>
            <DockIcon>
              <div onClick={toggleTheme} className="cursor-pointer">
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </div>
            </DockIcon>
          </DockItem>
          <DockItem>
            <DockLabel>Settings</DockLabel>
            <DockIcon>
              <Settings className="h-5 w-5" />
            </DockIcon>
          </DockItem>
        </Dock>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Sans Forgetica', sans-serif" }}>Nulsify</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-muted-foreground text-sm">
                {user.email || "Guest User"}
              </span>
            )}
            <Button variant="outline" onClick={signOut} className="w-28">
              Log Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Input Section - hide when we have cards (board-only view) */}
        {cards.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 relative"
          >
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Paste Your Meeting Notes</h2>
              </div>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title (optional)"
                className="w-full px-4 py-2 mb-3 rounded-lg border border-border bg-background/50 dark:bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type Here..."
                className="min-h-[200px] resize-none bg-background/50 dark:bg-background/80 border-border focus:border-primary transition-all duration-200"
              />
              <div className="flex gap-3 mt-4 flex-wrap">
                <GradientButton
                  onClick={handleProcess}
                  disabled={!notes.trim()}
                >
                  Process Notes
                </GradientButton>
                {cards.length > 0 && (
                  <>
                    <Button
                      onClick={handleExport}
                      variant="outline"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Summary
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSaveNote}
                      variant="default"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Save Note
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Processing State */}
        {processing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/20 p-8">
              <div className="flex flex-col items-center gap-4">
                <Loader />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    AI is extracting key insights...
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Analyzing your notes for decisions, action items, and questions
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Input Mode FAB */}
        {cards.length === 0 && (
          <FabButton onClick={handleProcess} label="Summarize Notes" />
        )}

        {/* Board Section */}
        {cards.length > 0 && (
          <div className="mt-4">
            <BoardContainer
              cards={freeCards}
              setCards={setFreeCards}
              zoom={zoom}
              setZoom={setZoom}
              onThemeToggle={toggleTheme}
              isDark={theme === "dark"}
            />
            <div className="mt-6 flex gap-3">
              <Button onClick={handleExport} variant="outline">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Summary
                  </>
                )}
              </Button>
              <Button onClick={handleSaveNote} variant="default">
                <FileText className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>
          </div>
        )}

        {/* Empty state if no cards and not processing remains unchanged */}
      </div>
    </div>
  );
}