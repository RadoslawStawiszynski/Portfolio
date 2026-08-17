// platform/src/components/blocks/BlockErrorBoundary.tsx
"use client";

import { Component, type ReactNode } from "react";

interface Props {
  blockType: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Izoluje crash pojedynczego bloku — bez tego jeden zepsuty blok (np. brakujące
// pole w danych) wywalał całą stronę portfolio (TD-01).
export class BlockErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // console.error zamiast `logger` (pino) — ten komponent trafia do bundla
    // przeglądarki ("use client"), a pino/thread-stream nie da się tam zbundlować.
    console.error(`[BlockErrorBoundary] blok "${this.props.blockType}" rzucił błąd:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[10rem] items-center justify-center p-8 text-center text-sm text-[var(--color-muted)]">
          Nie udało się załadować tej sekcji.
        </div>
      );
    }
    return this.props.children;
  }
}
