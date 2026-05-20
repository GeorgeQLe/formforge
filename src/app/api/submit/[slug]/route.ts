import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, count } from "drizzle-orm";
import { db } from "@/server/db";
import {
  forms,
  formVersions,
  formResponses,
  fieldResponses,
} from "@/server/db/schema";
import { buildLocalizedFormValidator, type FieldDef } from "@/lib/field-types";
import { evaluateConditionalLogic } from "@/lib/conditional-logic";
import { sendNotificationEmail } from "@/server/email/send-notification";
import { getTurnstileToken, verifyTurnstileToken } from "@/server/security/turnstile";
import { checkRateLimit, getClientIp } from "@/server/security/rate-limit";
import { resolveLocale, t } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// POST /api/submit/[slug]
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 0. Rate limit
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit({
      key: `submit:${slug}:${ip}`,
      limit: 10,
      windowMs: 60_000,
    });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: t("en", "error.tooManySubmissions") },
        { status: 429 }
      );
    }

    const body = await request.json();
    const locale = resolveLocale(body._locale);

    // 1. Verify Turnstile
    const turnstileToken = getTurnstileToken(body);
    if (!turnstileToken) {
      return NextResponse.json(
        { error: t(locale, "error.botRequired") },
        { status: 400 }
      );
    }

    const validTurnstile = await verifyTurnstileToken({
      token: turnstileToken,
      remoteIp: ip === "unknown" ? undefined : ip,
    });
    if (!validTurnstile) {
      return NextResponse.json(
        { error: t(locale, "error.botFailed") },
        { status: 400 }
      );
    }

    // 2. Load form + fields
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    if (!form) {
      return NextResponse.json({ error: t(locale, "error.formNotFound") }, { status: 404 });
    }

    if (form.status !== "published") {
      return NextResponse.json(
        { error: t(locale, "error.notAccepting") },
        { status: 400 }
      );
    }

    // 3. Load the immutable version snapshot this respondent submitted.
    const submittedVersionId =
      typeof body._formVersionId === "string" ? body._formVersionId : null;
    const [version] = submittedVersionId
      ? await db
          .select()
          .from(formVersions)
          .where(and(eq(formVersions.id, submittedVersionId), eq(formVersions.formId, form.id)))
          .limit(1)
      : await db
          .select()
          .from(formVersions)
          .where(eq(formVersions.formId, form.id))
          .orderBy(desc(formVersions.versionNumber))
          .limit(1);

    if (!version) {
      return NextResponse.json(
        { error: t(locale, "error.versionNotFound") },
        { status: 400 }
      );
    }

    // Check response limit
    if (version.settings?.responseLimit) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(formResponses)
        .where(eq(formResponses.formId, form.id));

      if (total >= version.settings.responseLimit) {
        return NextResponse.json(
          { error: t(locale, "error.responseLimit") },
          { status: 400 }
        );
      }
    }

    // Check close date
    if (version.settings?.closeDate) {
      const closeDate = new Date(version.settings.closeDate);
      if (new Date() > closeDate) {
        return NextResponse.json(
          { error: t(locale, "error.formClosed") },
          { status: 400 }
        );
      }
    }

    const fields = version.fieldsSnapshot;

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

    const validator = buildLocalizedFormValidator(fieldDefs, locale);
    const validationData: Record<string, unknown> = {};
    for (const field of visibleFields) {
      validationData[field.id] = body[field.id] ?? "";
    }

    const result = validator.safeParse(validationData);
    if (!result.success) {
      return NextResponse.json(
        { error: t(locale, "error.validationFailed"), issues: result.error.issues },
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
        formVersionId: version.id,
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
    if (version.settings?.notificationEmails?.length) {
      const fieldValuePairs = visibleFields.map((f) => ({
        label: f.label,
        value: String(body[f.id] ?? ""),
      }));

      sendNotificationEmail({
        to: version.settings.notificationEmails,
        formTitle: version.title,
        responseId: response!.id,
        fieldValues: fieldValuePairs,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.id}/responses/${response!.id}`,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: version.settings?.successMessage ?? t(locale, "form.defaultSuccess"),
      redirectUrl: version.settings?.redirectUrl ?? null,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: t("en", "error.internal") },
      { status: 500 }
    );
  }
}
