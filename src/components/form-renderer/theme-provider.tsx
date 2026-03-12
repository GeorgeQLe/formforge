"use client";

import type { ReactNode } from "react";
import type { ThemeColors } from "@/server/db/schema";

const DEFAULT_THEME: ThemeColors = {
  bg: "#ffffff",
  text: "#1f2937",
  primary: "#6366f1",
  border: "#e5e7eb",
  inputBg: "#ffffff",
  inputBorder: "#d1d5db",
  accent: "#818cf8",
};

export function ThemeProvider({
  children,
  colors,
}: {
  children: ReactNode;
  colors?: ThemeColors | null;
}) {
  const theme = colors ?? DEFAULT_THEME;

  const style = {
    "--form-bg": theme.bg,
    "--form-text": theme.text,
    "--form-primary": theme.primary,
    "--form-border": theme.border,
    "--form-input-bg": theme.inputBg,
    "--form-input-border": theme.inputBorder,
    "--form-accent": theme.accent,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className="rounded-xl p-6 md:p-8"
      data-theme="form"
    >
      <style>{`
        [data-theme="form"] {
          background: var(--form-bg);
          color: var(--form-text);
        }
        [data-theme="form"] input,
        [data-theme="form"] textarea,
        [data-theme="form"] select {
          background: var(--form-input-bg);
          border-color: var(--form-input-border);
          color: var(--form-text);
        }
        [data-theme="form"] input:focus,
        [data-theme="form"] textarea:focus,
        [data-theme="form"] select:focus {
          border-color: var(--form-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--form-primary) 20%, transparent);
        }
        [data-theme="form"] button[data-primary] {
          background: var(--form-primary);
          color: white;
        }
        [data-theme="form"] button[data-primary]:hover {
          filter: brightness(0.9);
        }
      `}</style>
      {children}
    </div>
  );
}
