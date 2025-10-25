import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [selected, setSelected] = useState<"meetings" | "school" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const updateUsageType = useMutation(api.users.updateUsageType.updateUsageType);

  const handleSubmit = async () => {
    if (!selected) return;
    
    setIsSubmitting(true);
    try {
      await updateUsageType({ usageType: selected });
      toast.success(`Great! Your experience is now optimized for ${selected === "meetings" ? "Meetings" : "School"}`);
      
      // Show welcome animation
      setShowWelcome(true);
      
      // Complete after animation
      setTimeout(() => {
        onComplete();
      }, 8000); // Show animation for 8 seconds
    } catch (error) {
      console.error("Failed to update usage type:", error);
      toast.error("Failed to save your preference. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Get words based on selected usage type
  const getWelcomeWords = () => {
    if (selected === "school") {
      return ["ClearPoint", "notes summariser", "study buddy"];
    }
    return ["ClearPoint", "the best summariser", "your meetings tool"];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {!showWelcome ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-2xl p-8 border-2">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to ClearPoint!
                </h2>
                <p className="text-muted-foreground text-lg">
                  What are you using this for?
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all border-2 ${
                      selected === "meetings"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelected("meetings")}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-full ${
                        selected === "meetings" ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Users className={`h-8 w-8 ${
                          selected === "meetings" ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Meetings
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Perfect for organizing team meetings, client calls, and professional discussions
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all border-2 ${
                      selected === "school"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelected("school")}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-full ${
                        selected === "school" ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <GraduationCap className={`h-8 w-8 ${
                          selected === "school" ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          School
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ideal for class notes, study sessions, and academic discussions
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!selected || isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="p-12 border-2">
              <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
                <LayoutTextFlip
                  text="Welcome to "
                  words={getWelcomeWords()}
                />
              </motion.div>
              <p className="mt-4 text-center text-base text-muted-foreground">
                {selected === "school" 
                  ? "Experience the power of organized notes that enhance your learning."
                  : "Experience the power of organized meetings that bring your ideas to life."}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}