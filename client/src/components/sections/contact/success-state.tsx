"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
        className="from-emerald/20 to-teal/10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br"
      >
        <CheckCircle2 className="text-emerald h-10 w-10" />
      </motion.div>
      <div>
        <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
        <p className="text-muted-foreground mt-2">
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
        </p>
      </div>
      <button
        onClick={onReset}
        className="text-emerald text-sm underline-offset-4 transition-colors hover:underline"
      >
        Send another message
      </button>
    </motion.div>
  );
}
