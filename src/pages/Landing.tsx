import { motion, useInView } from "framer-motion";
import { LightRays } from "@/components/ui/light-rays";
import { Button, LiquidButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Brain, Zap, Layout, ArrowRight, Sun, Moon, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import DisplayCards from "@/components/DisplayCards";
import { ContainerScroll } from "@/components/ContainerScroll";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import VaporizeTextCycle, { Tag } from "@/components/VaporizeTextCycle";
import { Logos } from "@/components/Logos";
import { HandWrittenTitle } from "@/components/HandWrittenTitle";
import { Timeline } from "@/components/Timeline";
import { Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter } from "@/components/ui/modal";
import { BackgroundPaths } from "@/components/BackgroundPaths";
import { TextLoop } from "@/components/ui/text-loop";
import { TextScramble } from "@/components/ui/text-scramble";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState("Features");
  const [isMobile, setIsMobile] = useState(false);
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, amount: 0.3 });

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const timelineData = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Launched ClearPoint to help teams organize meeting notes efficiently
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=500&fit=crop"
              alt="startup"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow"
            />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=500&fit=crop"
              alt="team meeting"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Built the core features: Smart extraction, visual organization, and instant export
          </p>
        </div>
      ),
    },
    {
      title: "Late 2023",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Started the journey to transform how teams handle meeting notes
          </p>
        </div>
      ),
    },
  ];

  const featureContent = [
    {
      title: "Smart Extraction",
      description:
        "Our AI-powered system automatically identifies and categorizes key information from your meeting notes. Decisions, action items, and questions are extracted instantly, saving you hours of manual work.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=500&fit=crop"
            alt="Smart extraction demo"
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Visual Organization",
      description:
        "See your meeting outcomes organized in a beautiful, intuitive board layout. Drag and drop cards between categories, rearrange priorities, and get a clear overview of what matters most.",
      content: (
        <div className="flex h-full w-full items-center justify-center text-white">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop"
            alt="Visual organization demo"
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Instant Export",
      description:
        "Generate formatted summaries with one click. Export your organized notes to share with your team, keeping everyone aligned on decisions, actions, and open questions.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop"
            alt="Export demo"
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with your team. Changes sync instantly, ensuring everyone stays on the same page. No more confusion about who's working on what or which version is current.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=500&fit=crop"
            alt="Collaboration demo"
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Floating Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      >
        <div className="backdrop-blur-lg bg-background/5 border border-border/20 rounded-full shadow-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-lg font-bold text-foreground">ClearPoint</span>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2 bg-transparent py-0.5 px-0.5 rounded-full">
              {[
                { name: "Features", href: "#features", icon: Sparkles },
                { name: "How It Works", href: "#how-it-works", icon: Layout },
                { name: "Timeline", href: "#timeline", icon: Clock },
                { name: "Get Started", href: "#get-started", icon: Zap },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setActiveTab(item.name)}
                    className={`relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors
                      ${isActive ? "bg-muted text-primary" : "text-foreground/80 hover:text-primary"}`}
                  >
                    <span className="hidden md:inline">{item.name}</span>
                    <span className="md:hidden inline-flex items-center">
                      <Icon size={18} strokeWidth={2.5} />
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="lamp"
                        className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                          <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.div>
                    )}
                  </a>
                );
              })}
            </div>
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
            <ShimmerButton
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              disabled={isLoading}
              className="text-sm"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </ShimmerButton>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-20 max-w-6xl relative">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <HoverBorderGradient
              as="div"
              containerClassName="mb-8"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>Transform Your Notes</span>
            </HoverBorderGradient>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <TextScramble
              as="h1"
              className="text-5xl md:text-7xl font-semibold text-foreground mb-6 tracking-tight -mt-8"
              duration={1.2}
              speed={0.04}
            >
              Turn Chaos Into
            </TextScramble>
            
            <TextScramble
              as="span"
              className="text-5xl md:text-7xl font-semibold text-primary tracking-tight block"
              duration={1.2}
              speed={0.04}
            >
              Crystal Clear Action
            </TextScramble>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex gap-4 justify-center flex-wrap mb-12 mt-8"
          >
            <LiquidButton
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="text-lg"
            >
              <Sparkles className="mr-2 h-5 w-5 inline" />
              {isAuthenticated ? "Go to Dashboard" : "Start Organizing"}
            </LiquidButton>
          </motion.div>

          {/* Feature Cards - Directly Under Buttons */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center mt-20"
          >
            <div className="scale-125">
              <DisplayCards
                cards={[
                  {
                    icon: <Brain className="size-4 text-blue-300" />,
                    title: "Smart Extraction",
                    description: "AI-powered objectives identification",
                    date: "Automatic categorization",
                    titleClassName: "text-blue-500",
                    className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
                  },
                  {
                    icon: <Layout className="size-4 text-purple-300" />,
                    title: "Visual Organization",
                    description: "Beautiful board layout",
                    date: "Color-coded cards",
                    titleClassName: "text-purple-500",
                    className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
                  },
                  {
                    icon: <Zap className="size-4 text-green-300" />,
                    title: "Instant Export",
                    description: "Formatted summaries",
                    date: "Share in seconds",
                    titleClassName: "text-green-500",
                    className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                  },
                ]}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase with StickyScroll */}
      <section id="features" className="container mx-auto px-4 max-w-6xl mb-20">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to transform your meeting notes
          </p>
        </motion.div>
        <StickyScroll content={featureContent} />
      </section>

      {/* Scroll Transition Container */}
      <section className="container mx-auto px-4 max-w-6xl">
        <ContainerScroll
          titleComponent={
            <div className="h-20 flex items-center justify-center -mt-8">
              <h2 className="text-5xl font-bold text-foreground">
                <TextLoop interval={3}>
                  <span>Bringing Efficiency To You</span>
                  <span>Organise Your Thoughts</span>
                </TextLoop>
              </h2>
            </div>
          }
        >
          <div className="flex justify-center items-center h-full">
            {/* Placeholder for scroll effect */}
          </div>
        </ContainerScroll>
      </section>

      {/* Logos Section */}
      <Logos heading="Trusted by teams everywhere" />

      {/* Timeline Section */}
      <section id="timeline" className="container mx-auto px-4 max-w-6xl mb-20">
        <Timeline data={timelineData} />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 max-w-6xl mb-20 mt-32">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
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
        </motion.div>
      </section>

      {/* Footer */}
      <BackgroundPaths
        title="ClearPoint"
        subtitle="Join teams who are saving hours every week"
        buttonText="Start Organizing"
        onButtonClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
      />
    </div>
  );
}