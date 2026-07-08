"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/Mehedihasan444",
    color: "hover:text-white",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://linkedin.com/in/mehedi-hasan-893500301",
    color: "hover:text-[#0a66c2]",
  },
  {
    icon: TwitterIcon,
    label: "Twitter / X",
    href: "https://twitter.com/MEHEDIH60833052",
    color: "hover:text-[#1d9bf0]",
  },
];

function SuccessState({ onReset }: { onReset: () => void }) {
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

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const inputs = formRef.current?.querySelectorAll(".contact-input");
      if (inputs) {
        gsap.fromTo(
          inputs,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, formRef);

    return () => ctx.revert();
  }, []);

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

  const inputCls = cn(
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white",
    "placeholder:text-muted-foreground/40",
    "transition-all duration-300",
    "focus:border-emerald/50 focus:ring-1 focus:ring-emerald/20 focus:outline-none",
    "hover:border-white/20",
  );

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="from-emerald/5 via-teal/5 absolute right-0 top-1/2 h-96 w-96 translate-x-1/3 rounded-full bg-gradient-to-l to-transparent blur-[150px]" />
        <div className="from-teal/5 absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gradient-to-t to-transparent blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Contact
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Have a project in mind or want to collaborate? I&apos;d love to hear from you.
              Let&apos;s create something amazing together.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {success ? (
                <SuccessState onReset={() => setSuccess(false)} />
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="contact-input">
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
                    </div>
                    <div className="contact-input">
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
                    </div>
                  </div>

                  <div className="contact-input">
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
                  </div>

                  <div className="contact-input">
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
                  </div>

                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={sending}
                      className="contact-input from-emerald to-teal hover:shadow-emerald/25 group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
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
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:col-span-2">
            {/* Contact info */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
                <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-white">Contact Info</h3>
                  <div className="text-muted-foreground mt-5 space-y-4 text-sm">
                    {[
                      {
                        Icon: Mail,
                        label: "Email",
                        value: "mehedihasan67705251@gmail.com",
                        href: "mailto:mehedihasan67705251@gmail.com",
                      },
                      {
                        Icon: MapPin,
                        label: "Location",
                        value: "Dhaka, Bangladesh 🇧🇩",
                        href: null,
                      },
                      {
                        Icon: Clock,
                        label: "Timezone",
                        value: "Asia/Dhaka (UTC+6)",
                        href: null,
                      },
                    ].map(({ Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="bg-emerald/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                          <Icon className="text-emerald h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-white/50">
                            {label}
                          </span>
                          {href ? (
                            <a
                              href={href}
                              className="hover:text-emerald mt-0.5 block transition-colors"
                            >
                              {value}
                            </a>
                          ) : (
                            <span className="mt-0.5 block text-white/70">{value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Availability & social */}
            <ScrollReveal direction="right" delay={0.45}>
              <div className="glass group relative rounded-xl p-6 transition-all duration-500 hover:border-white/20">
                <div className="from-teal/5 via-emerald/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="bg-emerald/70 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                      <span className="bg-emerald relative inline-flex h-2 w-2 rounded-full" />
                    </span>
                    <h3 className="text-emerald text-sm font-semibold">Currently Available</h3>
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    Open for freelance projects and full-time opportunities. Typical response time{" "}
                    <span className="text-white">within 24 hours</span>.
                  </p>

                  <div className="mt-4 flex gap-2">
                    <span className="bg-emerald/10 text-emerald rounded-full px-3 py-1 text-xs">
                      Freelance
                    </span>
                    <span className="bg-teal/10 text-teal rounded-full px-3 py-1 text-xs">
                      Remote
                    </span>
                    <span className="text-muted-foreground rounded-full bg-white/5 px-3 py-1 text-xs">
                      Full-time
                    </span>
                  </div>

                  {/* Social links */}
                  <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                    {socialLinks.map(({ icon: Icon, label, href, color }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`text-muted-foreground flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/5 ${color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
