import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Brain, Zap, Layout, ArrowRight, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Floating Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      >
        <div className="backdrop-blur-md bg-background/80 border border-border/50 rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-lg font-bold text-foreground">ClearPoint</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#get-started" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Get Started
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              disabled={isLoading}
              size="sm"
              className="rounded-full"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground text-sm font-medium">Transform Your Meeting Notes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Turn Chaos Into
            <br />
            <span className="text-primary">
              Crystal Clear Action
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Paste your messy meeting notes and watch as AI instantly organizes them into decisions, action items, and questions. No more scrolling through walls of text.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="text-lg px-8 py-6 rounded-full"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isAuthenticated ? "Go to Dashboard" : "Start Organizing"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-6 rounded-full"
            >
              See Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          id="features"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              icon: Brain,
              title: "Smart Extraction",
              description: "AI-powered pattern recognition automatically categorizes your notes into decisions, actions, and questions."
            },
            {
              icon: Layout,
              title: "Visual Organization",
              description: "See everything at a glance with color-coded cards in a beautiful, intuitive board layout."
            },
            {
              icon: Zap,
              title: "Instant Export",
              description: "Copy a perfectly formatted summary to share with your team in seconds."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="border border-border p-8 hover:shadow-lg transition-all h-full">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo Preview */}
        <motion.div
          id="how-it-works"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <Card className="border border-border p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="text-foreground font-semibold mb-2">Decisions</h4>
                <p className="text-muted-foreground text-sm">Key choices and agreements made during the meeting</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="text-4xl mb-3">✅</div>
                <h4 className="text-foreground font-semibold mb-2">Action Items</h4>
                <p className="text-muted-foreground text-sm">Tasks assigned with owners and deadlines</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="text-4xl mb-3">❓</div>
                <h4 className="text-foreground font-semibold mb-2">Questions</h4>
                <p className="text-muted-foreground text-sm">Open items that need follow-up or clarification</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          id="get-started"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="border border-border p-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to organize your meetings?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join teams who are saving hours every week with ClearPoint
            </p>
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="text-lg px-8 py-6 rounded-full"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Built with{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary underline transition-colors"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}