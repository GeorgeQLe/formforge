import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { forms, formVersions, themes } from "@/server/db/schema";
import { PublicFormClient } from "./client";
import { resolveLocale } from "@/lib/i18n";

export default async function PublicFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string; lang?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query.locale ?? query.lang);

  // Fetch form
  const [form] = await db
    .select()
    .from(forms)
    .where(eq(forms.slug, slug))
    .limit(1);

  if (!form || form.status !== "published") {
    notFound();
  }

  // Fetch the latest immutable published version for rendering.
  const [version] = await db
    .select()
    .from(formVersions)
    .where(eq(formVersions.formId, form.id))
    .orderBy(desc(formVersions.versionNumber))
    .limit(1);

  if (!version) {
    notFound();
  }

  const versionedForm = {
    ...form,
    title: version.title,
    description: version.description,
    settings: version.settings,
    themeId: version.themeId,
  };

  // Fetch theme
  let themeColors = null;
  if (version.themeId) {
    const [theme] = await db
      .select()
      .from(themes)
      .where(eq(themes.id, version.themeId))
      .limit(1);
    themeColors = theme?.colors ?? null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <PublicFormClient
          form={versionedForm}
          versionId={version.id}
          fields={version.fieldsSnapshot}
          themeColors={themeColors}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
          locale={locale}
        />
      </div>
    </div>
  );
}
