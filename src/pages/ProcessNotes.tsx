import { useAuth } from "@/hooks/use-auth";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader } from "@/components/ui/loader";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProcessNotes() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(8);
  
  const notes = location.state?.notes || "";
  const noteTitle = location.state?.noteTitle || "";
  
  const extractMeetingNotes = useAction(api.ai.extractMeetingNotes as any);

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
        
        // Navigate back to dashboard with extracted cards
        setTimeout(() => {
          navigate("/dashboard", { 
            state: { 
              cards: extracted,
              noteTitle: noteTitle,
              notes: notes
            } 
          });
        }, 500);
      } catch (error) {
        console.error("Error processing notes:", error);
        // Navigate back with error
        navigate("/dashboard", { 
          state: { 
            error: "Failed to process notes",
            notes: notes,
            noteTitle: noteTitle
          } 
        });
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
          className="w-full max-w-2xl"
        >
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
        </motion.div>
      </div>
    </>
  );
}