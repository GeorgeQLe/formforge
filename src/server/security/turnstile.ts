import { getEnv } from "@/env";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

interface VerifyTurnstileTokenOptions {
  token: string;
  remoteIp?: string;
  secret?: string;
  fetchImpl?: typeof fetch;
}

export function getTurnstileToken(body: Record<string, unknown>): string | null {
  const token = body._turnstileToken;
  if (typeof token !== "string") return null;

  const trimmed = token.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function verifyTurnstileToken({
  token,
  remoteIp,
  secret = getEnv().TURNSTILE_SECRET_KEY,
  fetchImpl = fetch,
}: VerifyTurnstileTokenOptions): Promise<boolean> {
  const params = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    params.set("remoteip", remoteIp);
  }

  const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as TurnstileResponse;
  return data.success === true;
}
