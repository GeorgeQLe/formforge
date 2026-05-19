import { z } from "zod";
import type { ThemeColors } from "@/server/db/schema";

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color like #4f46e5")
  .transform((value) => value.toLowerCase());

export const themeColorsSchema = z
  .object({
    bg: hexColorSchema,
    text: hexColorSchema,
    primary: hexColorSchema,
    border: hexColorSchema,
    inputBg: hexColorSchema,
    inputBorder: hexColorSchema,
    accent: hexColorSchema,
  })
  .strict();

export const themeNameSchema = z.string().trim().min(1).max(80);

export const defaultThemeColors: ThemeColors = {
  bg: "#ffffff",
  text: "#1f2937",
  primary: "#6366f1",
  border: "#e5e7eb",
  inputBg: "#ffffff",
  inputBorder: "#d1d5db",
  accent: "#818cf8",
};

