import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Home, AlertCircle } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Something is not right...</EmptyTitle>
          <EmptyDescription>
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-3 flex-wrap justify-center">
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
        </EmptyContent>
      </Empty>
    </motion.div>
  );
}