import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h1
        className="text-5xl md:text-6xl font-bold text-black"
        style={{ fontFamily: "'Sans Forgetica', sans-serif" }}
      >
        Nulsify
      </h1>
    </div>
  );
}