"use client";
import { useAuth } from "@/hooks/use-auth";
import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { AuthForm } from "@/components/AuthForm";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-purple-600/40 to-pink-500/30" />
      <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/20 via-transparent to-blue-500/20" />
      
      {/* Blur Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/30 rounded-full blur-[150px]" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full px-4"
      >
        <AuthForm redirectAfterAuth={redirectAfterAuth} />
      </motion.div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}