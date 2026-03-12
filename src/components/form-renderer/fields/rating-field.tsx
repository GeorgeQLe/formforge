"use client";

import { useState } from "react";
import type { FieldComponentProps } from "../form-renderer";

export function RatingField({ field, value, onChange, error, readonly }: FieldComponentProps) {
  const maxRating = field.validation?.max ?? 5;
  const minRating = field.validation?.min ?? 1;
  const currentValue = value ? parseInt(value, 10) : 0;
  const [hoverValue, setHoverValue] = useState(0);

  const stars = Array.from(
    { length: maxRating - minRating + 1 },
    (_, i) => i + minRating
  );

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.helpText && (
        <p className="text-xs text-gray-500 mb-2">{field.helpText}</p>
      )}
      <div
        className="flex gap-1 star-rating"
        role="radiogroup"
        aria-label={`Rating from ${minRating} to ${maxRating}`}
      >
        {stars.map((star) => {
          const filled = star <= (hoverValue || currentValue);
          return (
            <button
              key={star}
              type="button"
              onClick={() => {
                if (!readonly) onChange(String(star));
              }}
              onMouseEnter={() => !readonly && setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              disabled={readonly}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className="p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded disabled:cursor-not-allowed"
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  filled ? "text-amber-400" : "text-gray-300"
                }`}
                fill={filled ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          );
        })}
        {currentValue > 0 && (
          <span className="ml-2 text-sm text-gray-500 self-center">
            {currentValue}/{maxRating}
          </span>
        )}
      </div>
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
