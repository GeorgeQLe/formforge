import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { generateFormFromAI } from "@/server/ai/generate-form";
import { checkRateLimit } from "@/server/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rateLimitResult = checkRateLimit({
      key: `ai-generate:${user.id}`,
      limit: 5,
      windowMs: 60_000,
    });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many AI generation requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const prompt = body.prompt as string;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const { form, fields } = await generateFormFromAI(prompt, user.id);

    return NextResponse.json({
      id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
      fields: fields.map((f) => ({
        type: f.type,
        label: f.label,
        required: f.required,
      })),
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate form" },
      { status: 500 }
    );
  }
}
