import { describe, expect, it } from "vitest";
import { buildResponsesCsv, escapeCsvValue } from "@/server/responses/csv-export";

const submittedAt = new Date("2026-05-18T15:30:00.000Z");

describe("response CSV export", () => {
  it("escapes commas, quotes, and line breaks", () => {
    expect(escapeCsvValue("plain")).toBe("plain");
    expect(escapeCsvValue("last, first")).toBe('"last, first"');
    expect(escapeCsvValue('He said "hello"')).toBe('"He said ""hello"""');
    expect(escapeCsvValue("line one\nline two")).toBe('"line one\nline two"');
    expect(escapeCsvValue("line one\r\nline two")).toBe('"line one\r\nline two"');
  });

  it("returns stable headers for an empty response export", () => {
    const result = buildResponsesCsv({
      fields: [
        { id: "field-1", label: "Name" },
        { id: "field-2", label: "Question, with comma" },
      ],
      responses: [],
      fieldResponses: [],
      truncated: false,
    });

    expect(result).toEqual({
      csv: 'Response ID,Status,Submitted At,Completion Time (s),Name,"Question, with comma"',
      truncated: false,
    });
  });

  it("builds one row per response with field labels as headers", () => {
    const result = buildResponsesCsv({
      fields: [
        { id: "field-1", label: "Name" },
        { id: "field-2", label: "Notes" },
        { id: "field-3", label: "Missing Value" },
      ],
      responses: [
        {
          id: "response-1",
          status: "new",
          submittedAt,
          completionTime: 42,
        },
      ],
      fieldResponses: [
        {
          responseId: "response-1",
          fieldId: "field-1",
          value: "Ada Lovelace",
        },
        {
          responseId: "response-1",
          fieldId: "field-2",
          value: 'comma, quote " and newline\nkept',
        },
      ],
      truncated: false,
    });

    expect(result.csv).toBe(
      [
        "Response ID,Status,Submitted At,Completion Time (s),Name,Notes,Missing Value",
        'response-1,new,2026-05-18T15:30:00.000Z,42,Ada Lovelace,"comma, quote "" and newline\nkept",',
      ].join("\n")
    );
    expect(result.truncated).toBe(false);
  });

  it("preserves truncation metadata from the export query", () => {
    const result = buildResponsesCsv({
      fields: [],
      responses: [
        {
          id: "response-1",
          status: "new",
          submittedAt,
          completionTime: null,
        },
      ],
      fieldResponses: [],
      truncated: true,
    });

    expect(result.csv).toBe(
      [
        "Response ID,Status,Submitted At,Completion Time (s)",
        "response-1,new,2026-05-18T15:30:00.000Z,",
      ].join("\n")
    );
    expect(result.truncated).toBe(true);
  });
});
