"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";

function SuppressThreeWarnings() {
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
      originalWarn.apply(console, args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SuppressThreeWarnings />
      {children}
    </ThemeProvider>
  );
}
