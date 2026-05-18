"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const linkButtonClass = cn(
  "inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
);

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
          <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-indigo-600">FormForge</p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-950">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              The app hit an unexpected problem. Retry the page or return home.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={reset}>Try again</Button>
              <Link className={linkButtonClass} href="/">
                Go home
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
