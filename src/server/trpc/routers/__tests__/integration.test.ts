import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { appRouter } from "../_app";
import { formFields, forms, users } from "@/server/db/schema";
import type { Context } from "../../context";

type UserRow = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  plan: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FormRow = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  slug: string;
  status: string;
  settings: Record<string, unknown>;
  themeId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FieldRow = {
  id: string;
  formId: string;
  type: string;
  label: string;
  placeholder: string | null;
  helpText: string | null;
  required: boolean;
  options: unknown;
  validation: unknown;
  conditionalLogic: unknown;
  sortOrder: number;
  createdAt: Date;
};

type MockData = {
  users: UserRow[];
  forms: FormRow[];
  fields: FieldRow[];
};

function user(overrides: Partial<UserRow> = {}): UserRow {
  const now = new Date("2026-05-18T12:00:00.000Z");
  return {
    id: "00000000-0000-4000-8000-000000000001",
    clerkUserId: "clerk-user-1",
    email: "owner@example.com",
    name: "Owner",
    plan: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function form(overrides: Partial<FormRow> = {}): FormRow {
  const now = new Date("2026-05-18T12:00:00.000Z");
  return {
    id: "10000000-0000-4000-8000-000000000001",
    userId: "00000000-0000-4000-8000-000000000001",
    title: "Contact",
    description: null,
    slug: "contact-abcdef",
    status: "draft",
    settings: {},
    themeId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function field(overrides: Partial<FieldRow> = {}): FieldRow {
  return {
    id: "20000000-0000-4000-8000-000000000001",
    formId: "10000000-0000-4000-8000-000000000001",
    type: "text",
    label: "Name",
    placeholder: null,
    helpText: null,
    required: false,
    options: null,
    validation: null,
    conditionalLogic: null,
    sortOrder: 0,
    createdAt: new Date("2026-05-18T12:00:00.000Z"),
    ...overrides,
  };
}

class SelectQuery {
  private table: unknown;

  constructor(
    private readonly data: MockData,
    private readonly selection?: Record<string, unknown>
  ) {}

  from(table: unknown) {
    this.table = table;
    return this;
  }

  leftJoin() {
    return this;
  }

  where() {
    return this;
  }

  groupBy() {
    return this;
  }

  orderBy() {
    return this;
  }

  limit() {
    return this;
  }

  then<TResult1 = unknown[], TResult2 = never>(
    onfulfilled?: ((value: unknown[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return Promise.resolve(this.resolve()).then(onfulfilled, onrejected);
  }

  private resolve() {
    if (this.table === users) {
      return this.data.users;
    }

    if (this.table === forms) {
      if (this.selection && "formCount" in this.selection) {
        return [{ formCount: this.data.forms.length }];
      }

      if (this.selection && "responseCount" in this.selection) {
        return this.data.forms.map((formRow) => ({ ...formRow, responseCount: 0 }));
      }

      return this.data.forms;
    }

    if (this.table === formFields) {
      if (this.selection && "fieldCount" in this.selection) {
        return [{ fieldCount: this.data.fields.length }];
      }

      return [...this.data.fields].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return [];
  }
}

class InsertQuery {
  private rows: Record<string, unknown>[] = [];

  constructor(
    private readonly data: MockData,
    private readonly table: unknown
  ) {}

  values(row: Record<string, unknown> | Record<string, unknown>[]) {
    this.rows = Array.isArray(row) ? row : [row];
    return this;
  }

  returning() {
    const row = this.rows[0] ?? {};

    if (this.table === forms) {
      const inserted = form({
        ...row,
        id: `10000000-0000-4000-8000-${String(this.data.forms.length + 99).padStart(12, "0")}`,
        slug: String(row.slug),
      });
      this.data.forms.push(inserted);
      return Promise.resolve([inserted]);
    }

    if (this.table === formFields) {
      const inserted = field({
        ...row,
        id: `20000000-0000-4000-8000-${String(this.data.fields.length + 99).padStart(12, "0")}`,
      });
      this.data.fields.push(inserted);
      return Promise.resolve([inserted]);
    }

    return Promise.resolve([]);
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    if (this.table === formFields) {
      this.rows.forEach((row, index) => {
        this.data.fields.push(
          field({
            ...row,
            id: `20000000-0000-4000-8000-${String(this.data.fields.length + index + 99).padStart(12, "0")}`,
          })
        );
      });
    }

    return Promise.resolve(undefined).then(onfulfilled, onrejected);
  }
}

function createMockDb(data: MockData) {
  return {
    select: (selection?: Record<string, unknown>) => new SelectQuery(data, selection),
    insert: (table: unknown) => new InsertQuery(data, table),
  };
}

function caller(data: MockData, clerkUserId: string | null = "clerk-user-1") {
  return appRouter.createCaller({
    db: createMockDb(data),
    clerkUserId,
  } as unknown as Context);
}

describe("tRPC router integration", () => {
  it("rejects protected procedures when there is no authenticated Clerk user", async () => {
    await expect(
      caller({ users: [], forms: [], fields: [] }, null).form.list()
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns public forms by slug without requiring auth", async () => {
    const existing = form({ slug: "public-form" });

    await expect(
      caller({ users: [], forms: [existing], fields: [] }, null).form.getBySlug({
        slug: "public-form",
      })
    ).resolves.toEqual(existing);
  });

  it("creates a form for the resolved authenticated user", async () => {
    const data = { users: [user({ plan: "pro" })], forms: [], fields: [] };
    const created = await caller(data).form.create({
      title: "Lead Capture",
      description: "Website leads",
    });

    expect(created.userId).toBe(data.users[0]!.id);
    expect(created.title).toBe("Lead Capture");
    expect(created.description).toBe("Website leads");
    expect(created.slug).toMatch(/^lead-capture-[\w-]{6}$/);
  });

  it("enforces the free-plan form limit before creating another form", async () => {
    const data = {
      users: [user({ plan: "free" })],
      forms: [form({ id: "10000000-0000-4000-8000-000000000001" }), form({ id: "10000000-0000-4000-8000-000000000002" }), form({ id: "10000000-0000-4000-8000-000000000003" })],
      fields: [],
    };

    await expect(
      caller(data).form.create({ title: "Fourth form" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(data.forms).toHaveLength(3);
  });

  it("duplicates a form as a draft copy with all fields and no responses", async () => {
    const source = form({
      title: "Published intake",
      description: "Original description",
      status: "published",
      settings: { successMessage: "Done", gdprConsentEnabled: true },
      themeId: "30000000-0000-4000-8000-000000000001",
    });
    const data = {
      users: [user({ plan: "pro" })],
      forms: [source],
      fields: [
        field({
          id: "20000000-0000-4000-8000-000000000001",
          label: "Second",
          type: "email",
          required: true,
          sortOrder: 2,
          validation: { pattern: ".+@.+" },
        }),
        field({
          id: "20000000-0000-4000-8000-000000000002",
          label: "First",
          type: "text",
          placeholder: "Your name",
          helpText: "Use your legal name",
          options: [{ label: "A", value: "a" }],
          conditionalLogic: {
            action: "show",
            logic: "AND",
            showWhen: [{ fieldId: "x", operator: "equals", value: "yes" }],
          },
          sortOrder: 1,
        }),
      ],
    };

    const copied = await caller(data).form.duplicate({ id: source.id });

    expect(copied.id).not.toBe(source.id);
    expect(copied.title).toBe("Published intake copy");
    expect(copied.description).toBe(source.description);
    expect(copied.status).toBe("draft");
    expect(copied.settings).toEqual(source.settings);
    expect(copied.themeId).toBe(source.themeId);
    expect(copied.slug).toMatch(/^published-intake-copy-[\w-]{6}$/);

    const copiedFields = data.fields.filter((row) => row.formId === copied.id);
    expect(copiedFields).toHaveLength(2);
    expect(copiedFields.map((row) => row.label)).toEqual(["First", "Second"]);
    expect(copiedFields[0]).toMatchObject({
      formId: copied.id,
      type: "text",
      placeholder: "Your name",
      helpText: "Use your legal name",
      sortOrder: 1,
    });
    expect(copiedFields[1]).toMatchObject({
      formId: copied.id,
      type: "email",
      required: true,
      validation: { pattern: ".+@.+" },
      sortOrder: 2,
    });
  });

  it("enforces the free-plan form limit before duplicating a form", async () => {
    const data = {
      users: [user({ plan: "free" })],
      forms: [
        form({ id: "10000000-0000-4000-8000-000000000001" }),
        form({ id: "10000000-0000-4000-8000-000000000002" }),
        form({ id: "10000000-0000-4000-8000-000000000003" }),
      ],
      fields: [field()],
    };

    await expect(
      caller(data).form.duplicate({ id: "10000000-0000-4000-8000-000000000001" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(data.forms).toHaveLength(3);
    expect(data.fields).toHaveLength(1);
  });

  it("validates form update input through the router schema", async () => {
    await expect(
      caller({ users: [user()], forms: [form()], fields: [] }).form.update({
        id: "10000000-0000-4000-8000-000000000001",
        settings: {
          responseLimit: -1,
        },
      })
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("lists fields in sort order after verifying form ownership", async () => {
    const rows = await caller({
      users: [user()],
      forms: [form()],
      fields: [
        field({ id: "20000000-0000-4000-8000-000000000002", label: "Second", sortOrder: 2 }),
        field({ id: "20000000-0000-4000-8000-000000000001", label: "First", sortOrder: 1 }),
      ],
    }).field.list({ formId: "10000000-0000-4000-8000-000000000001" });

    expect(rows.map((row) => row.label)).toEqual(["First", "Second"]);
  });

  it("rejects field operations when the form ownership check finds no form", async () => {
    await expect(
      caller({ users: [user()], forms: [], fields: [] }).field.create({
        formId: "10000000-0000-4000-8000-000000000001",
        type: "text",
        label: "Name",
      })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
