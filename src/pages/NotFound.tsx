import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const joke = "Why did the web page go to therapy? It had too many broken links! 🔗";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-20 items-center">
            {/* Mobile Image - Shows only on mobile */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="sm:hidden flex justify-center"
            >
              <AlertCircle className="h-32 w-32 text-primary" />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg mb-4">
                <span className="text-sm font-semibold">Error 404</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Something is not right...
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Page you are trying to open does not exist. You may have mistyped the address, or the
                page has been moved to another URL. If you think this is an error contact support.
              </p>
              
              {/* Joke Section */}
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-foreground text-sm italic">
                  {joke}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/")}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Get back to home page
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </div>
            </motion.div>

            {/* Desktop Image - Shows only on desktop */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:flex justify-center"
            >
              <AlertCircle className="h-64 w-64 text-primary" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Lost? Let's get you back on track.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}