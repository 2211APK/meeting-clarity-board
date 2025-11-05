import { useAuth } from "@/hooks/use-auth";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { Loader2, Copy, Check, Sparkles, Home, FileText, Settings, Sun, Moon } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { GradientButton } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

type CardType = "decision" | "action" | "question";

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

  const saveNote = useMutation(api.notes.saveNote);
  const userNotes = useQuery(api.notes.getUserNotes);

  // Handle incoming state from ProcessNotes page
  useEffect(() => {
    if (location.state?.cards) {
      setCards(location.state.cards);
      if (location.state.noteTitle) setNoteTitle(location.state.noteTitle);
      if (location.state.notes) setNotes(location.state.notes);
      toast.success(`AI extracted ${location.state.cards.length} items from your notes`);
      // Clear the state
      navigate("/dashboard", { replace: true, state: {} });
    }
    if (location.state?.error) {
      toast.error(location.state.error);
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

  const extractCards = (text: string): NoteCard[] => {
    const lines = text.split("\n").filter(line => line.trim().length > 0);
    const extractedCards: NoteCard[] = [];
    let cardId = 0;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip headers and short lines
      if (trimmedLine.length < 10 || trimmedLine.startsWith("Meeting") || trimmedLine.startsWith("Attendees")) {
        return;
      }

      // Check for decisions
      if (
        /we decided|agreed that|going with|final decision|we're going with/i.test(trimmedLine)
      ) {
        extractedCards.push({
          id: `card-${cardId++}`,
          content: trimmedLine,
          type: "decision"
        });
        return;
      }

      // Check for action items
      if (
        /TODO:|ACTION:|will\s+\w+|needs? to|by\s+(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|end)/i.test(trimmedLine)
      ) {
        extractedCards.push({
          id: `card-${cardId++}`,
          content: trimmedLine,
          type: "action"
        });
        return;
      }

      // Check for questions
      if (
        trimmedLine.includes("?") ||
        /should we|need to (figure out|know|understand)|question:|what's|how do we/i.test(trimmedLine)
      ) {
        extractedCards.push({
          id: `card-${cardId++}`,
          content: trimmedLine,
          type: "question"
        });
      }
    });

    return extractedCards;
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

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }

    if (cards.length === 0) {
      toast.error("Please process some notes before saving");
      return;
    }

    try {
      await saveNote({
        title: noteTitle,
        content: notes,
        cards: cards,
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

    if (sourceType === destType && result.source.index === result.destination.index) {
      return;
    }

    const newCards = Array.from(cards);
    const sourceCards = newCards.filter(c => c.type === sourceType);
    const [movedCard] = sourceCards.splice(result.source.index, 1);
    
    movedCard.type = destType;
    
    const otherCards = newCards.filter(c => c.id !== movedCard.id);
    const destCards = otherCards.filter(c => c.type === destType);
    destCards.splice(result.destination.index, 0, movedCard);
    
    const finalCards = [
      ...otherCards.filter(c => c.type !== destType),
      ...destCards
    ];

    setCards(finalCards);
  };

  const handleExport = () => {
    const decisions = cards.filter(c => c.type === "decision");
    const actions = cards.filter(c => c.type === "action");
    const questions = cards.filter(c => c.type === "question");

    let output = "";
    
    if (decisions.length > 0) {
      output += "DECISIONS:\n";
      decisions.forEach(d => {
        output += `• ${d.content}\n`;
      });
      output += "\n";
    }

    if (actions.length > 0) {
      output += "ACTION ITEMS:\n";
      actions.forEach(a => {
        output += `• ${a.content}\n`;
      });
      output += "\n";
    }

    if (questions.length > 0) {
      output += "OPEN QUESTIONS:\n";
      questions.forEach(q => {
        output += `• ${q.content}\n`;
      });
    }

    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getCardsByType = (type: CardType) => cards.filter(c => c.type === type);

  const columnConfig = {
    decision: {
      title: "🎯 Decisions",
      bgClass: "bg-purple-500/10 border-purple-500/30",
      cardBg: "bg-purple-500/20 border-purple-400/40 hover:bg-purple-500/30"
    },
    action: {
      title: "✅ Action Items",
      bgClass: "bg-green-500/10 border-green-500/30",
      cardBg: "bg-green-500/20 border-green-400/40 hover:bg-green-500/30"
    },
    question: {
      title: "❓ Questions",
      bgClass: "bg-yellow-500/10 border-yellow-500/30",
      cardBg: "bg-yellow-500/20 border-yellow-400/40 hover:bg-yellow-500/30"
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="./logo.svg" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-foreground">Meeting Memory Board</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-muted-foreground text-sm">
                {user.email || "Guest User"}
              </span>
            )}
            <InteractiveHoverButton 
              text="Log Out" 
              onClick={signOut}
              className="w-28"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Input Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 relative"
        >
          {/* Simplified Premium Gradient Background */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl -z-10" />
          
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-white/30 dark:border-white/20 p-6 shadow-xl relative overflow-hidden">
            {/* Subtle glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Paste Your Meeting Notes</h2>
            </div>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title (optional)"
              className="w-full px-4 py-2 mb-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type Here..."
              className="min-h-[200px] resize-none backdrop-blur-sm bg-background/50 border-border focus:bg-background/70 transition-all duration-200"
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

        {/* Board Section */}
        {cards.length > 0 && !processing ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["decision", "action", "question"] as CardType[]).map((type, index) => {
                const config = columnConfig[type];
                const columnCards = getCardsByType(type);

                return (
                  <motion.div
                    key={type}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className={`backdrop-blur-sm ${config.bgClass} border p-4 shadow-lg min-h-[400px]`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground text-lg">
                          {config.title}
                        </h3>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {columnCards.length}
                        </span>
                      </div>

                      <Droppable droppableId={type}>
                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-3 min-h-[300px] rounded-lg p-2 transition-colors ${
                              snapshot.isDraggingOver ? "bg-white/10" : ""
                            }`}
                          >
                            <AnimatePresence>
                              {columnCards.map((card, index) => (
                                <Draggable key={card.id} draggableId={card.id} index={index}>
                                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`${config.cardBg} backdrop-blur-sm border rounded-lg p-4 shadow-md transition-all cursor-move ${
                                        snapshot.isDragging ? "shadow-2xl scale-105 rotate-2 z-[200]" : ""
                                      }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        zIndex: snapshot.isDragging ? 200 : 'auto',
                                      }}
                                    >
                                      <p className="text-foreground text-sm leading-relaxed">
                                        {card.content}
                                      </p>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </AnimatePresence>
                            {provided.placeholder}
                            {columnCards.length === 0 && (
                              <div className="text-center text-muted-foreground text-sm py-8">
                                No items yet
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </DragDropContext>
        ) : !processing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10 p-12 max-w-md mx-auto">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Process your meeting notes to see them organized into cards
              </p>
            </Card>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}