"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import type { forms, formFields, ThemeColors } from "@/server/db/schema";

interface PublicFormClientProps {
  form: typeof forms.$inferSelect;
  fields: (typeof formFields.$inferSelect)[];
  themeColors: ThemeColors | null;
  turnstileSiteKey: string;
}

export function PublicFormClient({
  form,
  fields,
  themeColors,
  turnstileSiteKey,
}: PublicFormClientProps) {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [startTime] = useState(() => Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Load Turnstile script
  useEffect(() => {
    if (!turnstileSiteKey) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => setTurnstileToken(token),
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [turnstileSiteKey]);

  const handleSubmitSuccess = useCallback(
    (data: { message: string; redirectUrl?: string | null }) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    []
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <FormRenderer
        mode="fill"
        form={form}
        fields={fields}
        themeColors={themeColors}
        turnstileToken={turnstileToken}
        completionStartTime={startTime}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {/* Turnstile widget */}
      {turnstileSiteKey && (
        <div className="px-6 pb-4">
          <div ref={turnstileRef} />
        </div>
      )}
    </div>
  );
}

// Extend window for Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => void;
    };
  }
}
