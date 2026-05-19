import { z } from "zod";

const runtimeEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),

  // Clerk
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Turnstile
  TURNSTILE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_REGION: z.string().min(1),
});

const buildEnvSchema = runtimeEnvSchema.pick({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: true,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: true,
  NEXT_PUBLIC_APP_URL: true,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: true,
});

export type Env = z.infer<typeof runtimeEnvSchema>;
export type BuildEnv = z.infer<typeof buildEnvSchema>;

let _env: Env | null = null;

function formatEnvIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
}

export function validateBuildEnv(env: NodeJS.ProcessEnv = process.env): BuildEnv {
  const parsed = buildEnvSchema.safeParse(env);

  if (!parsed.success) {
    throw new Error(
      `FormForge build environment validation failed:\n${formatEnvIssues(parsed.error)}`
    );
  }

  return parsed.data;
}

export function validateRuntimeEnv(env: NodeJS.ProcessEnv = process.env): Env {
  const parsed = runtimeEnvSchema.safeParse(env);

  if (!parsed.success) {
    throw new Error(
      `FormForge runtime environment validation failed:\n${formatEnvIssues(parsed.error)}`
    );
  }

  return parsed.data;
}

/**
 * Lazily validated environment variables.
 * Throws on first access if any required variable is missing.
 * Server-side only -- do not import in client components.
 */
export function getEnv(): Env {
  if (_env) return _env;

  _env = validateRuntimeEnv();
  return _env;
}
