import { describe, expect, it } from "vitest";

import { validateBuildEnv, validateRuntimeEnv } from "@/env";

const validRuntimeEnv = {
  DATABASE_URL: "postgresql://user:pass@example.com/db",
  CLERK_SECRET_KEY: "sk_test_clerk",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_clerk",
  STRIPE_SECRET_KEY: "sk_test_stripe",
  STRIPE_WEBHOOK_SECRET: "whsec_test",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_stripe",
  RESEND_API_KEY: "re_test",
  OPENAI_API_KEY: "sk-openai",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  TURNSTILE_SECRET_KEY: "turnstile-secret",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "turnstile-site-key",
  AWS_ACCESS_KEY_ID: "AKIATEST",
  AWS_SECRET_ACCESS_KEY: "aws-secret",
  AWS_S3_BUCKET: "formforge-uploads",
  AWS_REGION: "us-east-1",
};

describe("environment validation", () => {
  it("validates only build-required public variables for build time", () => {
    const buildEnv = validateBuildEnv({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: validRuntimeEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validRuntimeEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_APP_URL: validRuntimeEnv.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: validRuntimeEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    });

    expect(buildEnv).toEqual({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: validRuntimeEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validRuntimeEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_APP_URL: validRuntimeEnv.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: validRuntimeEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    });
  });

  it("reports a project-owned build error for missing or invalid build variables", () => {
    expect(() =>
      validateBuildEnv({
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "",
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validRuntimeEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        NEXT_PUBLIC_APP_URL: "not-a-url",
      })
    ).toThrowErrorMatchingInlineSnapshot(`
      [Error: FormForge build environment validation failed:
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Too small: expected string to have >=1 characters
      - NEXT_PUBLIC_APP_URL: Invalid URL
      - NEXT_PUBLIC_TURNSTILE_SITE_KEY: Invalid input: expected string, received undefined]
    `);
  });

  it("keeps full runtime validation for server secrets", () => {
    expect(validateRuntimeEnv(validRuntimeEnv)).toEqual(validRuntimeEnv);

    expect(() =>
      validateRuntimeEnv({
        ...validRuntimeEnv,
        STRIPE_SECRET_KEY: "",
      })
    ).toThrowErrorMatchingInlineSnapshot(`
      [Error: FormForge runtime environment validation failed:
      - STRIPE_SECRET_KEY: Too small: expected string to have >=1 characters]
    `);
  });
});
