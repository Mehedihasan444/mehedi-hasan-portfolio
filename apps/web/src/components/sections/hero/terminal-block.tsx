"use client";

import { terminalLines } from "./constants";

// Decorative and hidden from assistive tech — renders statically with no
// motion work. Kept `hidden sm:block` so it stays off small screens.
export function TerminalBlock() {
  return (
    <div
      className="glass mt-8 hidden w-full max-w-md rounded-xl p-4 font-mono text-xs sm:block"
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="text-muted-foreground/40 ml-2 text-[10px]">portfolio — zsh</span>
      </div>
      {terminalLines.map((line) => (
        <div key={line.cmd} className="flex gap-2">
          <span className="text-emerald">❯</span>
          <span className="text-white/80">{line.cmd}</span>
        </div>
      ))}
      <div className="text-emerald/70 mt-1">✓ Ready on http://localhost:3000</div>
    </div>
  );
}
