export type ApiScope = "forms:read" | "responses:read" | "responses:write" | "webhooks:read";

export type ApiKeyPreview = {
  id: string;
  name: string;
  prefix: string;
  scopes: ApiScope[];
  createdAt: string;
  lastUsed: string;
  status: "active" | "draft";
};

export type ApiExample = {
  method: "GET" | "POST";
  path: string;
  title: string;
  scope: ApiScope;
  description: string;
};

export const SCOPE_LABELS: Record<ApiScope, string> = {
  "forms:read": "Read forms",
  "responses:read": "Read responses",
  "responses:write": "Create responses",
  "webhooks:read": "Read webhooks",
};

export const SCOPE_SUMMARIES: Record<ApiScope, string> = {
  "forms:read": "List forms, inspect form schemas, and read publish status.",
  "responses:read": "Export response rows and read submission metadata.",
  "responses:write": "Submit responses to a published form from a server client.",
  "webhooks:read": "Inspect configured webhook destinations and delivery status.",
};

export const PROTOTYPE_API_KEYS: ApiKeyPreview[] = [
  {
    id: "key-production",
    name: "Production backend",
    prefix: "ff_live_prod",
    scopes: ["forms:read", "responses:read"],
    createdAt: "May 12, 2026",
    lastUsed: "18 min ago",
    status: "active",
  },
  {
    id: "key-reporting",
    name: "Reporting sandbox",
    prefix: "ff_test_report",
    scopes: ["responses:read", "webhooks:read"],
    createdAt: "May 15, 2026",
    lastUsed: "Never",
    status: "draft",
  },
];

export const API_EXAMPLES: ApiExample[] = [
  {
    method: "GET",
    path: "/v1/forms",
    title: "List forms",
    scope: "forms:read",
    description: "Fetch owned forms with status, slug, and response totals.",
  },
  {
    method: "GET",
    path: "/v1/forms/{form_id}/responses",
    title: "Export responses",
    scope: "responses:read",
    description: "Read normalized response rows for analytics or warehouse sync.",
  },
  {
    method: "POST",
    path: "/v1/forms/{form_id}/responses",
    title: "Create response",
    scope: "responses:write",
    description: "Submit a response from a trusted server integration.",
  },
  {
    method: "GET",
    path: "/v1/webhooks",
    title: "List webhooks",
    scope: "webhooks:read",
    description: "Preview configured webhook destinations and delivery health.",
  },
];

export const DEFERRED_API_INFRASTRUCTURE = [
  "API key hashing, storage, and one-time secret reveal",
  "Business-plan authorization and owner-scoped token issuance",
  "Versioned public endpoint contract and OpenAPI documentation",
  "Durable rate limits, audit logs, revocation, and rotation",
  "Webhook delivery signatures, retry policy, and developer docs",
];

export function maskApiKey(prefix: string): string {
  return `${prefix}_************************`;
}

export function validateKeyName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Name this key before previewing it.";
  }

  if (trimmed.length < 3) {
    return "Use at least 3 characters.";
  }

  return null;
}

export function describeScopes(scopes: ApiScope[]): string {
  if (scopes.length === 0) {
    return "No scopes selected";
  }

  return scopes.map((scope) => SCOPE_LABELS[scope]).join(", ");
}

export function buildKeyPrefix(name: string, mode: "test" | "live"): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 12);

  return `ff_${mode}_${slug || "key"}`;
}

export function buildCurlExample(example: ApiExample, apiKey: string): string {
  const lines = [
    `curl https://api.formforge.dev${example.path} \\`,
    `  -H "Authorization: Bearer ${apiKey}" \\`,
    `  -H "Accept: application/json"${example.method === "POST" ? " \\" : ""}`,
  ];

  if (example.method === "POST") {
    lines.push(`  -H "Content-Type: application/json" \\`);
    lines.push(`  -d '{"fields":{"email":"customer@example.com"}}'`);
  }

  return lines.join("\n");
}

export function buildResponsePreview(example: ApiExample): string {
  if (example.method === "POST") {
    return JSON.stringify(
      {
        id: "resp_01hxy8",
        status: "accepted",
        submitted_at: "2026-05-19T14:25:00Z",
      },
      null,
      2
    );
  }

  if (example.scope === "responses:read") {
    return JSON.stringify(
      {
        data: [
          {
            id: "resp_01hxy8",
            form_id: "form_customer_onboarding",
            submitted_at: "2026-05-19T14:25:00Z",
          },
        ],
        has_more: false,
      },
      null,
      2
    );
  }

  return JSON.stringify(
    {
      data: [
        {
          id: "form_customer_onboarding",
          title: "Customer onboarding",
          status: "published",
        },
      ],
    },
    null,
    2
  );
}
