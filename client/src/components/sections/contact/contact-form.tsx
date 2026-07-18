"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { SpinnerIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { SuccessState } from "./success-state";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const inputCls = cn(
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white",
  "placeholder:text-muted-foreground/40",
  "transition-all duration-300",
  "focus:border-emerald/50 focus:ring-1 focus:ring-emerald/20 focus:outline-none",
  "hover:border-white/20",
);

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(formRef, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return <SuccessState onReset={() => setSuccess(false)} />;
  }

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <motion.div custom={0} variants={inputVariants}>
          <label
            htmlFor="name"
            className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wider"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            className={inputCls}
          />
        </motion.div>
        <motion.div custom={1} variants={inputVariants}>
          <label
            htmlFor="email"
            className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wider"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className={inputCls}
          />
        </motion.div>
      </div>

      <motion.div custom={2} variants={inputVariants}>
        <label
          htmlFor="subject"
          className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wider"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="What's this about?"
          className={inputCls}
        />
      </motion.div>

      <motion.div custom={3} variants={inputVariants}>
        <label
          htmlFor="message"
          className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wider"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell me about your project..."
          className={cn(inputCls, "resize-none")}
        />
      </motion.div>

      <MagneticButton>
        <motion.div custom={4} variants={inputVariants}>
          <button
            type="submit"
            disabled={sending}
            className="from-emerald to-teal hover:shadow-emerald/25 group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:opacity-50"
          >
            {sending ? (
              <>
                <SpinnerIcon className="h-4 w-4" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </motion.div>
      </MagneticButton>
    </motion.form>
  );
}
