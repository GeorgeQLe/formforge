import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../[slug]/route";

const { dbMocks, turnstileMocks, emailMocks } = vi.hoisted(() => ({
  dbMocks: {
    select: vi.fn(),
    insert: vi.fn(),
  },
  turnstileMocks: {
    getTurnstileToken: vi.fn(),
    verifyTurnstileToken: vi.fn(),
  },
  emailMocks: {
    sendNotificationEmail: vi.fn(),
  },
}));

vi.mock("@/server/db", () => ({
  db: dbMocks,
}));

vi.mock("@/server/security/turnstile", () => turnstileMocks);

vi.mock("@/server/email/send-notification", () => emailMocks);

const publishedForm = {
  id: "form-1",
  userId: "user-1",
  title: "Contact",
  description: null,
  slug: "contact",
  status: "published",
  settings: {},
  themeId: null,
  createdAt: new Date("2026-05-01T00:00:00.000Z"),
  updatedAt: new Date("2026-05-01T00:00:00.000Z"),
};

const textField = {
  id: "field-1",
  formId: "form-1",
  type: "text",
  label: "Name",
  placeholder: null,
  helpText: null,
  required: true,
  options: null,
  validation: null,
  conditionalLogic: null,
  sortOrder: 0,
  createdAt: new Date("2026-05-01T00:00:00.000Z"),
};

function chainReturning<T>(value: T) {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue(value),
    limit: vi.fn().mockResolvedValue(value),
  };
}

function whereReturning<T>(value: T) {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(value),
  };
}

function insertReturning<T>(value: T) {
  return {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(value),
  };
}

function insertValuesOnly() {
  return {
    values: vi.fn().mockResolvedValue(undefined),
  };
}

async function submit(body: Record<string, unknown>) {
  return POST(
    new Request("https://formforge.test/api/submit/contact", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.10" },
      body: JSON.stringify(body),
    }) as never,
    { params: Promise.resolve({ slug: "contact" }) }
  );
}

describe("submit response settings", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    turnstileMocks.getTurnstileToken.mockReturnValue("token");
    turnstileMocks.verifyTurnstileToken.mockResolvedValue(true);
  });

  it("accepts and stores a submission below the response limit", async () => {
    dbMocks.select
      .mockReturnValueOnce(chainReturning([{ ...publishedForm, settings: { responseLimit: 2 } }]))
      .mockReturnValueOnce(whereReturning([{ total: 1 }]))
      .mockReturnValueOnce(chainReturning([textField]));
    dbMocks.insert
      .mockReturnValueOnce(insertReturning([{ id: "response-1" }]))
      .mockReturnValueOnce(insertValuesOnly());

    const response = await submit({
      _turnstileToken: "token",
      "field-1": "Ada Lovelace",
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ success: true });
    expect(dbMocks.insert).toHaveBeenCalledTimes(2);
  });

  it("rejects and does not store when the response limit has been reached", async () => {
    dbMocks.select
      .mockReturnValueOnce(chainReturning([{ ...publishedForm, settings: { responseLimit: 2 } }]))
      .mockReturnValueOnce(whereReturning([{ total: 2 }]));

    const response = await submit({
      _turnstileToken: "token",
      "field-1": "Grace Hopper",
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ error: "This form has reached its response limit" });
    expect(dbMocks.insert).not.toHaveBeenCalled();
  });

  it("accepts and stores a submission before the close date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-17T12:00:00.000Z"));
    dbMocks.select
      .mockReturnValueOnce(
        chainReturning([
          { ...publishedForm, settings: { closeDate: "2026-05-18T12:00:00.000Z" } },
        ])
      )
      .mockReturnValueOnce(chainReturning([textField]));
    dbMocks.insert
      .mockReturnValueOnce(insertReturning([{ id: "response-1" }]))
      .mockReturnValueOnce(insertValuesOnly());

    const response = await submit({
      _turnstileToken: "token",
      "field-1": "Katherine Johnson",
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ success: true });
    expect(dbMocks.insert).toHaveBeenCalledTimes(2);
  });

  it("rejects and does not store after the close date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-19T12:00:00.000Z"));
    dbMocks.select.mockReturnValueOnce(
      chainReturning([
        { ...publishedForm, settings: { closeDate: "2026-05-18T12:00:00.000Z" } },
      ])
    );

    const response = await submit({
      _turnstileToken: "token",
      "field-1": "Dorothy Vaughan",
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ error: "This form is closed" });
    expect(dbMocks.insert).not.toHaveBeenCalled();
  });
});
