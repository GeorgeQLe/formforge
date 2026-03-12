import OpenAI from "openai";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { forms, formFields } from "@/server/db/schema";
import type { FieldType } from "@/lib/field-types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// ---------------------------------------------------------------------------
// AI response schema
// ---------------------------------------------------------------------------
const aiFieldSchema = z.object({
  type: z.enum([
    "text",
    "email",
    "number",
    "dropdown",
    "radio",
    "checkbox",
    "textarea",
    "date",
    "rating",
    "file_upload",
  ]),
  label: z.string(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean(),
  options: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      fileTypes: z.array(z.string()).optional(),
      maxFileSize: z.number().optional(),
    })
    .optional(),
  conditionalLogicHint: z
    .object({
      dependsOnLabel: z.string(),
      operator: z.enum([
        "equals",
        "not_equals",
        "contains",
        "greater_than",
        "less_than",
        "is_empty",
        "is_not_empty",
      ]),
      value: z.string().optional(),
      action: z.enum(["show", "hide"]),
    })
    .optional(),
});

const aiFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  fields: z.array(aiFieldSchema),
});

export type AIFormResponse = z.infer<typeof aiFormSchema>;

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are FormForge AI, an expert at creating web forms from natural language descriptions.

Given a description, generate a complete form with:
- An appropriate title and description
- Well-chosen field types (text, email, number, dropdown, radio, checkbox, textarea, date, rating, file_upload)
- Meaningful placeholder text and help text where useful
- Required flags set sensibly (name, email are usually required)
- Options for dropdown/radio/checkbox fields with realistic choices
- Validation rules where appropriate (min/max length, patterns)
- Conditional logic hints when fields should only appear based on other field values

For conditional logic, use "conditionalLogicHint" with the LABEL of the field it depends on (not ID).

Return ONLY valid JSON matching the schema. Be practical and thorough.`;

// ---------------------------------------------------------------------------
// Generate form from natural language
// ---------------------------------------------------------------------------
export async function generateFormFromAI(
  prompt: string,
  userId: string
): Promise<{ form: typeof forms.$inferSelect; fields: (typeof formFields.$inferSelect)[] }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Create a form for: ${prompt}\n\nRespond with a JSON object matching this structure: { title: string, description: string, fields: [{ type, label, placeholder?, helpText?, required, options?, validation?, conditionalLogicHint?: { dependsOnLabel, operator, value?, action } }] }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const parsed = aiFormSchema.parse(JSON.parse(content));

  // ---------------------------------------------------------------------------
  // Persist in a transaction
  // ---------------------------------------------------------------------------
  const slug =
    parsed.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50) +
    "-" +
    nanoid(6);

  const [form] = await db
    .insert(forms)
    .values({
      userId,
      title: parsed.title,
      description: parsed.description,
      slug,
      status: "draft",
    })
    .returning();

  // Insert fields (first pass, without conditional logic)
  const insertedFields: (typeof formFields.$inferSelect)[] = [];

  for (let i = 0; i < parsed.fields.length; i++) {
    const f = parsed.fields[i]!;
    const [field] = await db
      .insert(formFields)
      .values({
        formId: form!.id,
        type: f.type,
        label: f.label,
        placeholder: f.placeholder ?? null,
        helpText: f.helpText ?? null,
        required: f.required,
        options: f.options ?? null,
        validation: f.validation ?? null,
        conditionalLogic: null,
        sortOrder: i,
      })
      .returning();

    insertedFields.push(field!);
  }

  // Second pass: resolve conditional logic label references to IDs
  const labelToId = new Map<string, string>();
  for (const field of insertedFields) {
    labelToId.set(field.label.toLowerCase(), field.id);
  }

  for (let i = 0; i < parsed.fields.length; i++) {
    const hint = parsed.fields[i]!.conditionalLogicHint;
    if (!hint) continue;

    const dependsOnId = labelToId.get(hint.dependsOnLabel.toLowerCase());
    if (!dependsOnId) continue;

    const conditionalLogic = {
      showWhen: [
        {
          fieldId: dependsOnId,
          operator: hint.operator,
          value: hint.value,
        },
      ],
      logic: "AND" as const,
      action: hint.action,
    };

    await db
      .update(formFields)
      .set({ conditionalLogic })
      .where(eq(formFields.id, insertedFields[i]!.id));

    insertedFields[i] = { ...insertedFields[i]!, conditionalLogic };
  }

  return { form: form!, fields: insertedFields };
}
