export type CsvExportField = {
  id: string;
  label: string;
};

export type CsvExportResponse = {
  id: string;
  status: string;
  submittedAt: Date;
  completionTime: number | null;
};

export type CsvExportFieldResponse = {
  responseId: string;
  fieldId: string;
  value: string | null;
};

const BASE_HEADERS = [
  "Response ID",
  "Status",
  "Submitted At",
  "Completion Time (s)",
];

export function escapeCsvValue(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function buildResponsesCsv({
  fields,
  responses,
  fieldResponses,
  truncated,
}: {
  fields: CsvExportField[];
  responses: CsvExportResponse[];
  fieldResponses: CsvExportFieldResponse[];
  truncated: boolean;
}) {
  const headers = [...BASE_HEADERS, ...fields.map((field) => field.label)];
  const valuesByResponseId = new Map<string, Map<string, string>>();

  for (const fieldResponse of fieldResponses) {
    const values =
      valuesByResponseId.get(fieldResponse.responseId) ?? new Map<string, string>();
    values.set(fieldResponse.fieldId, fieldResponse.value ?? "");
    valuesByResponseId.set(fieldResponse.responseId, values);
  }

  const rows = responses.map((response) => {
    const values = valuesByResponseId.get(response.id) ?? new Map<string, string>();

    return [
      response.id,
      response.status,
      response.submittedAt.toISOString(),
      String(response.completionTime ?? ""),
      ...fields.map((field) => values.get(field.id) ?? ""),
    ];
  });

  const csvLines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ];

  return { csv: csvLines.join("\n"), truncated };
}
