"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE } from "@/lib/constants";
import type { GuestbookEntry } from "@/lib/api-public";

const MAX_MESSAGE = 280;

const inputCls = cn(
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white",
  "placeholder:text-muted-foreground/40",
  "transition-all duration-300",
  "focus:border-emerald/50 focus:ring-1 focus:ring-emerald/20 focus:outline-none",
  "hover:border-white/20",
);

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function GuestbookClient({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot — bots fill it; pretend success and drop the entry.
    if (website.trim()) {
      toast.success("Thanks for signing the guestbook!");
      setName("");
      setMessage("");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }
    if (message.trim().length < 3) {
      toast.error("Message must be at least 3 characters.");
      return;
    }
    if (message.trim().length > MAX_MESSAGE) {
      toast.error(`Keep it under ${MAX_MESSAGE} characters.`);
      return;
    }
    setSending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(`${API_BASE}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim(), website: "" }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Failed to sign. Please try again.");
        return;
      }
      const data: unknown = await res.json();
      const created =
        data && typeof data === "object" && "data" in data
          ? (data as { data: GuestbookEntry }).data
          : null;
      if (created && typeof created.id === "string") {
        setEntries((prev) => (prev.some((p) => p.id === created.id) ? prev : [created, ...prev]));
        if (!created.approved) {
          setPendingIds((prev) => new Set(prev).add(created.id));
        }
      }
      setName("");
      setMessage("");
      setWebsite("");
      toast.success("Note received — it'll appear on the wall after approval.");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      clearTimeout(timeout);
      setSending(false);
    }
  };

  return (
    <div className="mt-16 grid min-w-0 gap-8 lg:grid-cols-5">
      <form
        onSubmit={handleSubmit}
        className="glass min-w-0 rounded-xl p-6 sm:p-8 lg:col-span-2"
        aria-label="Sign the guestbook"
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <MessageSquareHeart className="text-emerald h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-medium text-white">Leave a note</h3>
            <p className="text-muted-foreground text-xs">Published after a quick review</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="guestbook-name"
              className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wider"
            >
              Name
            </label>
            <input
              id="guestbook-name"
              type="text"
              autoComplete="name"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputCls}
            />
          </div>
          <div>
            <label
              htmlFor="guestbook-message"
              className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wider"
            >
              Message
            </label>
            <textarea
              id="guestbook-message"
              rows={4}
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say hello, share feedback…"
              className={cn(inputCls, "resize-none")}
            />
            <p className="text-muted-foreground mt-1.5 text-right text-xs tabular-nums">
              {message.length}/{MAX_MESSAGE}
            </p>
          </div>

          {/* Honeypot — offscreen, not display:none so bots still fill it */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="guestbook-website">Website</label>
            <input
              id="guestbook-website"
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            aria-busy={sending}
            className="from-emerald to-teal hover:shadow-emerald/25 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:opacity-50"
          >
            <Send size={15} aria-hidden="true" />
            {sending ? "Signing…" : "Sign Guestbook"}
          </button>
        </div>
      </form>

      <div className="min-w-0 lg:col-span-3">
        <ul className="space-y-4" aria-label="Guestbook entries">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="glass group relative rounded-xl p-5 transition-all duration-500 hover:border-white/20"
            >
              <div className="from-emerald/5 via-teal/5 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex gap-4">
                <div
                  className="from-emerald/20 to-teal/10 font-heading flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {initials(entry.name) || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-2 truncate text-sm font-medium text-white">
                      <span className="truncate">{entry.name}</span>
                      {pendingIds.has(entry.id) && (
                        <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                          Pending review
                        </span>
                      )}
                    </p>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {entry.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {entries.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No entries yet — be the first to sign!
          </p>
        )}
      </div>
    </div>
  );
}
