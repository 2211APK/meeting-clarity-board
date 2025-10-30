import { motion, useInView } from "framer-motion";
import { LightRays } from "@/components/ui/light-rays";
import { Button, LiquidButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Brain, Zap, Layout, ArrowRight, Sun, Moon, Clock, Shield, Users } from "lucide-react";
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
  ];

  // Mobile warning screen
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Layout className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">
              📱 Mobile Not Supported
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Mobile is currently not supported.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Please try again on desktop.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Sorry for the inconvenience caused!
            </p>
            <p className="text-sm font-semibold text-foreground">
              - ClearPoint
            </p>
          </div>
        </Card>
      </div>
    );
  }

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
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
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
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
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
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: "easeOut" }}
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
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
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

      {/* Features Section */}
      <section id="features" className="py-16 md:py-32">
        <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
          <div className="relative">
            <div className="relative z-10 grid grid-cols-6 gap-3">
              <Card className="relative col-span-full flex overflow-hidden sm:col-span-3 lg:col-span-2 lg:row-span-1">
                <div className="relative m-auto size-fit pt-6">
                  <div className="relative flex h-24 w-56 items-center">
                    <svg className="text-muted absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="mx-auto block w-fit text-5xl font-semibold">100%</span>
                  </div>
                  <h2 className="mt-6 text-center text-3xl font-semibold">Customizable</h2>
                </div>
              </Card>
              
              <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                <div className="pt-6">
                  <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Shield className="m-auto size-16" strokeWidth={1} />
                  </div>
                  <div className="relative z-10 mt-6 space-y-2 text-center px-6">
                    <h2 className="text-3xl font-semibold transition dark:text-white">Secure by default</h2>
                    <p className="text-muted-foreground">Your meeting notes are encrypted and stored securely. We never access your data without permission.</p>
                  </div>
                </div>
              </Card>
              
              <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                <div className="pt-6">
                  <div className="pt-6 lg:px-6">
                    <svg className="dark:text-muted-foreground w-full" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_0_106)">
                        <circle className="text-muted-foreground dark:text-muted" cx="29" cy="29" r="15" fill="currentColor" />
                        <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                        fill="url(#paint0_linear_0_106)"
                      />
                      <path
                        className="text-primary-600 dark:text-primary-500"
                        d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <defs>
                        <linearGradient id="paint0_linear_0_106" x1="3" y1="60" x2="3" y2="123" gradientUnits="userSpaceOnUse">
                          <stop className="text-primary/15 dark:text-primary/35" stopColor="currentColor" />
                          <stop className="text-transparent" offset="1" stopColor="currentColor" stopOpacity="0.103775" />
                        </linearGradient>
                        <clipPath id="clip0_0_106">
                          <rect width="358" height="30" fill="white" transform="translate(14 14)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="relative z-10 mt-14 space-y-2 text-center px-6">
                    <h2 className="text-3xl font-semibold transition">Lightning Fast</h2>
                    <p className="text-muted-foreground">Process thousands of meeting notes in seconds with our optimized extraction engine.</p>
                  </div>
                </div>
              </Card>
              
              <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-3 lg:row-span-2">
                <div className="pt-6 h-full flex flex-col justify-center">
                  <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Users className="m-auto size-16" strokeWidth={1} />
                  </div>
                  <div className="relative z-10 mt-6 space-y-2 text-center px-6">
                    <h2 className="text-3xl font-semibold transition dark:text-white">Team Collaboration</h2>
                    <p className="text-muted-foreground">Share organized notes with your team instantly. Keep everyone aligned on decisions and action items.</p>
                  </div>
                </div>
              </Card>
              
              <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-3 lg:row-span-2">
                <div className="pt-6 h-full flex flex-col justify-center">
                  <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Brain className="m-auto size-16" strokeWidth={1} />
                  </div>
                  <div className="relative z-10 mt-6 space-y-2 text-center px-6">
                    <h2 className="text-3xl font-semibold transition dark:text-white">AI-Powered</h2>
                    <p className="text-muted-foreground">Intelligent extraction algorithms that learn from your meeting patterns to improve accuracy over time.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of teams organizing their meetings better
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              rotateX: 5,
              z: 50,
              transition: { duration: 0.3 }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card className="h-full p-6 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Product Manager</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">
                "ClearPoint has transformed how our team handles meeting notes. What used to take hours now takes minutes!"
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              rotateX: 5,
              z: 50,
              transition: { duration: 0.3 }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card className="h-full p-6 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">Engineering Lead</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">
                "The smart extraction feature is incredible. It catches action items I would have missed manually."
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              rotateX: 5,
              z: 50,
              transition: { duration: 0.3 }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card className="h-full p-6 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Emily Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Team Lead</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">
                "Finally, a tool that makes meeting follow-ups actually happen. Our team accountability has improved dramatically."
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase with StickyScroll */}
      <section className="container mx-auto px-4 max-w-6xl mb-20 mt-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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

      {/* Timeline Section */}
      <section id="timeline" className="container mx-auto px-4 max-w-6xl mb-20">
        <Timeline data={timelineData} />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 max-w-6xl mb-20 mt-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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