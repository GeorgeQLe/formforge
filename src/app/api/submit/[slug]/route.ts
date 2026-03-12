import { NextRequest, NextResponse } from "next/server";
import { eq, asc, count } from "drizzle-orm";
import { db } from "@/server/db";
import { forms, formFields, formResponses, fieldResponses } from "@/server/db/schema";
import { buildFormValidator, type FieldDef } from "@/lib/field-types";
import { evaluateConditionalLogic } from "@/lib/conditional-logic";
import { sendNotificationEmail } from "@/server/email/send-notification";

// ---------------------------------------------------------------------------
// Verify Cloudflare Turnstile token
// ---------------------------------------------------------------------------
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip if not configured

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  );

  const data = (await response.json()) as { success: boolean };
  return data.success;
}

// ---------------------------------------------------------------------------
// POST /api/submit/[slug]
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // 1. Verify Turnstile
    const turnstileToken = body._turnstileToken as string | undefined;
    if (turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Bot verification failed" },
          { status: 403 }
        );
      }
    }

    // 2. Load form + fields
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status !== "published") {
      return NextResponse.json(
        { error: "This form is not accepting responses" },
        { status: 400 }
      );
    }

    // Check response limit
    if (form.settings?.responseLimit) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(formResponses)
        .where(eq(formResponses.formId, form.id));

      if (total >= form.settings.responseLimit) {
        return NextResponse.json(
          { error: "This form has reached its response limit" },
          { status: 400 }
        );
      }
    }

    // Check close date
    if (form.settings?.closeDate) {
      const closeDate = new Date(form.settings.closeDate);
      if (new Date() > closeDate) {
        return NextResponse.json(
          { error: "This form is closed" },
          { status: 400 }
        );
      }
    }

    // 3. Load fields
    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.id))
      .orderBy(asc(formFields.sortOrder));

    // 4. Evaluate conditional logic to determine visible fields
    const formValues: Record<string, string | undefined> = {};
    for (const field of fields) {
      formValues[field.id] = body[field.id] as string | undefined;
    }

    const visibleFields = fields.filter((field) =>
      evaluateConditionalLogic(field.conditionalLogic, formValues)
    );

    // 5. Validate visible fields
    const fieldDefs: FieldDef[] = visibleFields.map((f) => ({
      id: f.id,
      type: f.type as FieldDef["type"],
      label: f.label,
      required: f.required,
      options: f.options,
      validation: f.validation,
    }));

    const validator = buildFormValidator(fieldDefs);
    const validationData: Record<string, unknown> = {};
    for (const field of visibleFields) {
      validationData[field.id] = body[field.id] ?? "";
    }

    const result = validator.safeParse(validationData);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    // 6. Store response
    const completionTime = body._completionTime
      ? parseInt(body._completionTime as string, 10)
      : null;

    const [response] = await db
      .insert(formResponses)
      .values({
        formId: form.id,
        completionTime,
      })
      .returning();

    // Insert field responses
    const fieldResponseValues = visibleFields.map((field) => ({
      responseId: response!.id,
      fieldId: field.id,
      fieldLabelSnapshot: field.label,
      value: String(body[field.id] ?? ""),
    }));

    if (fieldResponseValues.length > 0) {
      await db.insert(fieldResponses).values(fieldResponseValues);
    }

    // 7. Fire notification email (fire-and-forget)
    if (form.settings?.notificationEmails?.length) {
      const fieldValuePairs = visibleFields.map((f) => ({
        label: f.label,
        value: String(body[f.id] ?? ""),
      }));

      sendNotificationEmail({
        to: form.settings.notificationEmails,
        formTitle: form.title,
        responseId: response!.id,
        fieldValues: fieldValuePairs,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.id}/responses/${response!.id}`,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: form.settings?.successMessage ?? "Thank you for your response!",
      redirectUrl: form.settings?.redirectUrl ?? null,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
