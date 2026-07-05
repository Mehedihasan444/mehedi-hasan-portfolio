"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

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
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest">
            Contact
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
            Let&apos;s create something amazing together.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {[
              { id: "name", label: "Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "subject", label: "Subject", type: "text" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="sr-only">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  required
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  placeholder={field.label}
                  className={cn(
                    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                    "placeholder:text-muted-foreground",
                    "transition-all duration-300",
                    "focus:border-cyan/50 focus:ring-cyan/20 focus:outline-none focus:ring-1",
                  )}
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message"
                className={cn(
                  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                  "placeholder:text-muted-foreground",
                  "resize-none transition-all duration-300",
                  "focus:border-cyan/50 focus:ring-cyan/20 focus:outline-none focus:ring-1",
                )}
              />
            </div>

            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="from-cyan to-purple inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-medium text-white">Contact Info</h3>
              <div className="text-muted-foreground mt-4 space-y-4 text-sm">
                <div>
                  <span className="text-white">Email</span>
                  <a
                    href="mailto:mehedihasan67705251@gmail.com"
                    className="mt-1 block transition-colors hover:text-white"
                  >
                    mehedihasan67705251@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-white">Location</span>
                  <p className="mt-1">Dhaka, Bangladesh</p>
                </div>
                <div>
                  <span className="text-white">Availability</span>
                  <p className="text-cyan mt-1">Open for opportunities</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-medium text-white">Quick Response</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                I typically respond within 24 hours during business days.
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Available for freelance projects and full-time opportunities.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
