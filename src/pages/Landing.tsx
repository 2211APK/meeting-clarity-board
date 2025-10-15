import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Brain, Zap, Layout, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 -z-10" />
      
      {/* Blurred Circles */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="./logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Meeting Memory Board</span>
          </div>
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
          >
            {isAuthenticated ? "Dashboard" : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Transform Your Meeting Notes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Turn Chaos Into
            <br />
            <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Crystal Clear Action
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Paste your messy meeting notes and watch as AI instantly organizes them into decisions, action items, and questions. No more scrolling through walls of text.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="bg-white text-purple-600 hover:bg-white/90 shadow-2xl text-lg px-8 py-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isAuthenticated ? "Go to Dashboard" : "Start Organizing"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-8 py-6"
            >
              See Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
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
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 hover:bg-white/15 transition-all shadow-xl h-full">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo Preview */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="backdrop-blur-sm bg-purple-500/20 border border-purple-400/40 rounded-lg p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="text-white font-semibold mb-2">Decisions</h4>
                <p className="text-white/70 text-sm">Key choices and agreements made during the meeting</p>
              </div>
              <div className="backdrop-blur-sm bg-green-500/20 border border-green-400/40 rounded-lg p-6">
                <div className="text-4xl mb-3">✅</div>
                <h4 className="text-white font-semibold mb-2">Action Items</h4>
                <p className="text-white/70 text-sm">Tasks assigned with owners and deadlines</p>
              </div>
              <div className="backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/40 rounded-lg p-6">
                <div className="text-4xl mb-3">❓</div>
                <h4 className="text-white font-semibold mb-2">Questions</h4>
                <p className="text-white/70 text-sm">Open items that need follow-up or clarification</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to organize your meetings?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join teams who are saving hours every week with Meeting Memory Board
            </p>
            <Button
              size="lg"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="bg-white text-purple-600 hover:bg-white/90 shadow-2xl text-lg px-8 py-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-white/10 border-t border-white/20 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60 text-sm">
            Built with{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}