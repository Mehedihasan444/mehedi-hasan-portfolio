"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  label: string;
}

interface State {
  failed: boolean;
}

/**
 * Per-section error boundary for the homepage. A single section throwing
 * (e.g. a lazy chunk failing to load, or WebGL blowing up on weak hardware)
 * degrades to a quiet placeholder instead of replacing the entire page via
 * the root error boundary — the rest of the page keeps scrolling.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[Section:${this.props.label}]`, error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="mx-auto max-w-7xl px-6 py-16" role="status">
          <p className="text-muted-foreground text-center text-sm">
            This section couldn&apos;t load. The rest of the page works fine.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
