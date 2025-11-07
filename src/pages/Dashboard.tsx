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
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Input mode state
  const [noteTitle, setNoteTitle] = useState("");
  const [notes, setNotes] = useState(EXAMPLE_NOTES);

  // Board mode state
  const [cards, setCards] = useState<NoteCard[]>([]);
  const [freeCards, setFreeCards] = useState<FreeCard[]>([]);
  const [zoom, setZoom] = useState(1);

  // Feedback
  const [copied, setCopied] = useState(false);

  // Convex
  const saveNote = useMutation(api.notes.saveNote);
  // Optional: keep for future user history views (unused UI-wise)
  useQuery(api.notes.getUserNotes);

  // Single-toast guard for navigation returns from /process-notes
  const handledNavigationRef = useRef(false);

  // Normalize to the new categories
  const normalizeType = (t: string): CardType => {
    const s = (t || "").toLowerCase();
    if (s.includes("decision") || s.includes("high")) return "high_importance";
    if (s.includes("action") || s.includes("todo") || s.includes("task")) return "todo";
    if (s.includes("question") || s.includes("?")) return "questions";
    if (s.includes("people") || s.includes("owner") || s.includes("assignee") || s.includes("assigned")) return "people";
    if (s.includes("follow")) return "follow_up";
    return "todo";
  };

  // Heuristic extractor for a live preview in Input Mode (not persisted)
  const extractCards = (text: string): NoteCard[] => {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const extracted: NoteCard[] = [];
    let id = 0;

    for (const line of lines) {
      const t = line.trim();
      if (t.length < 10 || /^meeting|^attendees/i.test(t)) continue;

      if (/follow[-\s]?up|follow up/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "follow_up" });
        continue;
      }
      if (/we decided|final decision|agreed that|we're going with|going with/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "high_importance" });
        continue;
      }
      if (/\b([A-Z][a-z]+)\b\s+(will|needs? to|to)\b/i.test(t) || /owner|assignee/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "people" });
        continue;
      }
      if (/TODO:|ACTION:|needs? to|will\s+\w+|by\s+(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|end)/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "todo" });
        continue;
      }
      if (t.includes("?") || /should we|question:|what's|how do we/i.test(t)) {
        extracted.push({ id: `card-${id++}`, content: t, type: "questions" });
        continue;
      }
    }
    return extracted;
  };

  const previewCards = useMemo(() => extractCards(notes), [notes]);

  // Handle return from /process-notes with single toast
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

      // Initialize free board positions
      const cols = Math.max(1, Math.floor((window.innerWidth - 200) / 320));
      const initial: FreeCard[] = mapped.map((c, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 48 + col * 320;
        const y = 120 + row * 240;
        return { ...c, x, y, w: 300, h: 180 };
      });
      setFreeCards(initial);

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

  // Theme init and auth redirect
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/auth");
  }, [isLoading, isAuthenticated, navigate]);

  // Actions
  const handleProcess = () => {
    if (!notes.trim()) {
      toast.error("Please enter some notes to process");
      return;
    }
    navigate("/process-notes", { state: { notes, noteTitle } });
  };

  const mapToLegacyType = (t: CardType): "decision" | "action" | "question" => {
    if (t === "high_importance") return "decision";
    if (t === "questions") return "question";
    return "action";
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }
    const source = freeCards.length > 0 ? freeCards : cards;
    if (source.length === 0) {
      toast.error("Please process some notes before saving");
      return;
    }
    try {
      const legacyCards = source.map((c) => ({
        id: c.id,
        content: c.content,
        type: mapToLegacyType(c.type as CardType),
      }));
      await saveNote({ title: noteTitle, content: notes, cards: legacyCards });
      toast.success("Note saved successfully!");
      setNoteTitle("");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save note");
    }
  };

  const handleExport = () => {
    const high = (freeCards.length ? freeCards : cards).filter((c) => c.type === "high_importance");
    const todos = (freeCards.length ? freeCards : cards).filter((c) => c.type === "todo");
    const people = (freeCards.length ? freeCards : cards).filter((c) => c.type === "people");
    const questions = (freeCards.length ? freeCards : cards).filter((c) => c.type === "questions");
    const followUps = (freeCards.length ? freeCards : cards).filter((c) => c.type === "follow_up");

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Force disable Thinking Board on this page (we'll show results on a different page)
  const isThinkingBoard = false;

  // Column helpers for Input Mode preview
  const byType = (type: CardType) => previewCards.filter((c) => c.type === type);
  const columnMeta: Record<CardType, { title: string; badge: string }> = {
    high_importance: { title: "High Importance", badge: "🔥" },
    todo: { title: "To Do", badge: "📝" },
    people: { title: "People Involved", badge: "👥" },
    questions: { title: "Questions", badge: "❓" },
    follow_up: { title: "Follow-ups", badge: "🔁" },
  };

  return (
    <div className="min-h-screen relative overflow-visible bg-background">
      {/* Top Dock */}
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
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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

      {/* Glass Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Sans Forgetica', sans-serif" }}>
              Nulsify
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && <span className="text-muted-foreground text-sm">{user.email || "Guest User"}</span>}
            <Button variant="outline" onClick={signOut} className="w-28">
              Log Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <AnimatePresence mode="wait">
          {!isThinkingBoard ? (
            <motion.div
              key="input-mode"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Grid: Left Input / Right Preview Columns */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left: Notes Input */}
                <div className="col-span-12 lg:col-span-5">
                  <Card className="backdrop-blur-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">✨ Paste Your Meeting Notes</h2>
                    </div>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note title (optional)"
                      className="w-full px-4 py-2 mb-3 rounded-full border border-white/20 dark:border-white/10 bg-background/50 dark:bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Type Here..."
                      className="min-h-[260px] resize-none bg-background/50 dark:bg-background/80 border-white/20 dark:border-white/10 focus:border-primary transition-all"
                    />
                    <div className="flex gap-3 mt-4 flex-wrap">
                      <Button onClick={handleProcess} disabled={!notes.trim()} className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Summarize Notes
                      </Button>
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
                      <Button onClick={handleSaveNote} variant="secondary">
                        <FileText className="h-4 w-4 mr-2" />
                        Save Note
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Right preview removed to separate input from summarized results */}
              </div>

              {/* FAB */}
              <FabButton onClick={handleProcess} label="Summarize Notes" />
            </motion.div>
          ) : (
            <motion.div
              key="thinking-board"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-2"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ... keep existing code (helper preview column component for input mode)
function PreviewColumn({ title, items }: { title: string; items: Array<{ id: string; content: string }> }) {
  return (
    <Card className="backdrop-blur-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-4 min-h-[180px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-xs text-muted-foreground">No items yet</div>
        ) : (
          items.slice(0, 6).map((i) => (
            <div
              key={i.id}
              className="text-sm rounded-md border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 px-3 py-2"
            >
              {i.content}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}