import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { forms, formFields, themes } from "@/server/db/schema";
import { PublicFormClient } from "./client";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch form
  const [form] = await db
    .select()
    .from(forms)
    .where(eq(forms.slug, slug))
    .limit(1);

  if (!form || form.status !== "published") {
    notFound();
  }

  // Fetch fields
  const fields = await db
    .select()
    .from(formFields)
    .where(eq(formFields.formId, form.id))
    .orderBy(asc(formFields.sortOrder));

  // Fetch theme
  let themeColors = null;
  if (form.themeId) {
    const [theme] = await db
      .select()
      .from(themes)
      .where(eq(themes.id, form.themeId))
      .limit(1);
    themeColors = theme?.colors ?? null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <PublicFormClient
          form={form}
          fields={fields}
          themeColors={themeColors}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        />
      </div>
    </div>
  );
}
