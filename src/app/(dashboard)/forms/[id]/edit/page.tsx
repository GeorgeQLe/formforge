"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { EditorProvider, useEditor } from "@/components/form-editor/editor-provider";
import { FieldPalette } from "@/components/form-editor/field-palette";
import { EditorCanvas } from "@/components/form-editor/editor-canvas";
import { FieldProperties } from "@/components/form-editor/field-properties";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

function EditorTopBar() {
  const { state, dispatch } = useEditor();
  const { toast } = useToast();
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);

  const updateFormMutation = trpc.form.update.useMutation();
  const publishMutation = trpc.form.publish.useMutation();

  if (!state.form) return null;

  const handleTitleChange = async (newTitle: string) => {
    if (!state.form) return;
    try {
      await updateFormMutation.mutateAsync({
        id: state.form.id,
        title: newTitle,
      });
    } catch {
      // silent fail, will be saved on next auto-save
    }
  };

  const handlePublish = async () => {
    if (!state.form) return;
    try {
      await publishMutation.mutateAsync({ id: state.form.id });
      toast({
        title: "Form published!",
        description: "Your form is now live and accepting responses.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Publish failed",
        description: error?.message ?? "Could not publish form",
        variant: "destructive",
      });
    }
  };

  if (isPreview) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsPreview(false)}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Back to Editor
            </Button>
            <Badge variant="outline">Preview Mode</Badge>
          </div>
        </div>
        <div className="max-w-2xl mx-auto p-8">
          <FormRenderer
            mode="preview"
            form={state.form}
            fields={state.fields}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <Input
            defaultValue={state.form.title}
            onBlur={(e) => handleTitleChange(e.target.value)}
            className="border-none bg-transparent font-semibold text-gray-900 text-lg px-0 focus:ring-0 focus:border-none max-w-xs"
          />
          <Badge
            variant={
              state.form.status === "published"
                ? "success"
                : state.form.status === "closed"
                ? "destructive"
                : "outline"
            }
          >
            {state.form.status}
          </Badge>
          {state.isDirty && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "UNDO" })}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "REDO" })}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <Button variant="outline" size="sm" onClick={() => setIsPreview(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Preview
          </Button>
          <Link href={`/forms/${state.form.id}/responses`}>
            <Button variant="outline" size="sm">
              Responses
            </Button>
          </Link>
          <Link href={`/forms/${state.form.id}/settings`}>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
          </Link>
          {state.form.status === "draft" && (
            <Button size="sm" onClick={handlePublish}>
              Publish
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FieldPalette />
        <EditorCanvas />
        <FieldProperties />
      </div>
    </>
  );
}

export default function FormEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <EditorProvider formId={id}>
      <div className="flex flex-col h-screen -m-8 -mx-6">
        <EditorTopBar />
      </div>
    </EditorProvider>
  );
}
