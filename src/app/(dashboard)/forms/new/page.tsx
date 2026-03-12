"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const EXAMPLE_PROMPTS = [
  { label: "Contact Form", prompt: "A simple contact form with name, email, phone, subject, and message" },
  { label: "Event Registration", prompt: "An event registration form with name, email, company, dietary restrictions, session selection, and t-shirt size" },
  { label: "Feedback Survey", prompt: "A customer feedback survey with overall rating, product quality, service quality, what they liked, what could be improved, and would they recommend us" },
  { label: "Job Application", prompt: "A job application form with personal info, position applied for, experience level, resume upload, cover letter, availability, and salary expectations" },
];

export default function NewFormPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<{
    id: string;
    title: string;
    description: string | null;
    fields: { type: string; label: string; required: boolean }[];
  } | null>(null);

  const createFormMutation = trpc.form.create.useMutation();
  const publishMutation = trpc.form.publish.useMutation();

  const generateForm = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedForm(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate form");
      }

      const data = await response.json();
      setGeneratedForm(data);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate form. Try again or create manually.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateManual = async () => {
    try {
      const form = await createFormMutation.mutateAsync({
        title: "Untitled Form",
        description: "",
      });
      router.push(`/forms/${form.id}/edit`);
    } catch {
      toast({ title: "Error", description: "Failed to create form", variant: "destructive" });
    }
  };

  const handleEditInEditor = () => {
    if (generatedForm) {
      router.push(`/forms/${generatedForm.id}/edit`);
    }
  };

  const handlePublishNow = async () => {
    if (!generatedForm) return;
    try {
      await publishMutation.mutateAsync({ id: generatedForm.id });
      toast({ title: "Published!", description: "Your form is now live.", variant: "success" });
      router.push(`/forms/${generatedForm.id}/responses`);
    } catch (error: any) {
      toast({
        title: "Publish failed",
        description: error?.message ?? "Could not publish form",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create a New Form</h1>
        <p className="text-gray-500 mt-1">
          Describe your form in plain English and let AI build it for you.
        </p>
      </div>

      {/* AI Generation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            AI Form Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the form you want to create. For example: 'A customer feedback form with ratings for service, food quality, and atmosphere, plus a comments section.'"
            className="min-h-[120px] mb-4"
          />

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setPrompt(ex.prompt)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={generateForm} disabled={isGenerating || !prompt.trim()}>
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Form"
              )}
            </Button>
            <Button variant="outline" onClick={handleCreateManual}>
              Create Blank Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {isGenerating && (
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 bg-gray-100 rounded flex-1" />
                  <div className="h-6 w-16 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated form preview */}
      {generatedForm && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedForm.title}</CardTitle>
            {generatedForm.description && (
              <p className="text-sm text-gray-500">{generatedForm.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {generatedForm.fields.map((field, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono w-6">
                      {i + 1}.
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {field.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">
                      {field.type}
                    </span>
                    {field.required && (
                      <span className="text-xs text-red-500 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleEditInEditor}>Edit in Editor</Button>
              <Button variant="secondary" onClick={handlePublishNow}>
                Publish Now
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedForm(null);
                  generateForm();
                }}
              >
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
