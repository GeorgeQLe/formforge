import { describe, expect, it, vi } from "vitest";
import {
  getTurnstileToken,
  verifyTurnstileToken,
} from "@/server/security/turnstile";

describe("Turnstile verification", () => {
  it("treats missing or blank Turnstile tokens as absent", () => {
    expect(getTurnstileToken({})).toBeNull();
    expect(getTurnstileToken({ _turnstileToken: "" })).toBeNull();
    expect(getTurnstileToken({ _turnstileToken: "   " })).toBeNull();
    expect(getTurnstileToken({ _turnstileToken: 123 })).toBeNull();
  });

  it("extracts a submitted Turnstile token", () => {
    expect(getTurnstileToken({ _turnstileToken: " token-123 " })).toBe(
      "token-123"
    );
  });

  it("returns false when Cloudflare rejects the token", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 200 })
    );

    await expect(
      verifyTurnstileToken({
        token: "bad-token",
        secret: "test-secret",
        fetchImpl,
      })
    ).resolves.toBe(false);
  });

  it("returns true when Cloudflare accepts the token", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );

    await expect(
      verifyTurnstileToken({
        token: "good-token",
        remoteIp: "203.0.113.10",
        secret: "test-secret",
        fetchImpl,
      })
    ).resolves.toBe(true);

    const request = fetchImpl.mock.calls[0]?.[1] as RequestInit;
    expect(request.method).toBe("POST");
    expect(request.body).toBeInstanceOf(URLSearchParams);
    expect((request.body as URLSearchParams).get("response")).toBe("good-token");
    expect((request.body as URLSearchParams).get("remoteip")).toBe(
      "203.0.113.10"
    );
  });

  it("returns false when the verification request fails", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 500 })
    );

    await expect(
      verifyTurnstileToken({
        token: "token",
        secret: "test-secret",
        fetchImpl,
      })
    ).resolves.toBe(false);
  });
});
