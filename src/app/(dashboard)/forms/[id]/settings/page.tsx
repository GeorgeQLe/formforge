"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { FormSettings } from "@/server/db/schema";

export default function FormSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: formId } = use(params);
  const { toast } = useToast();

  const formQuery = trpc.form.getById.useQuery({ id: formId });
  const updateMutation = trpc.form.update.useMutation();
  const closeMutation = trpc.form.close.useMutation();
  const publishMutation = trpc.form.publish.useMutation();
  const deleteMutation = trpc.form.delete.useMutation();

  const [settings, setSettings] = useState<FormSettings>({});
  const [notificationEmailInput, setNotificationEmailInput] = useState("");

  useEffect(() => {
    if (formQuery.data?.settings) {
      setSettings(formQuery.data.settings);
      setNotificationEmailInput(
        formQuery.data.settings.notificationEmails?.join(", ") ?? ""
      );
    }
  }, [formQuery.data]);

  const handleSave = async () => {
    try {
      const notificationEmails = notificationEmailInput
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      await updateMutation.mutateAsync({
        id: formId,
        settings: { ...settings, notificationEmails },
      });

      toast({ title: "Settings saved", variant: "success" });
      formQuery.refetch();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const form = formQuery.data;

  if (!form) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/forms/${formId}/edit`}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Settings</h1>
          <p className="text-sm text-gray-500">{form.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Notification Emails</Label>
              <Input
                value={notificationEmailInput}
                onChange={(e) => setNotificationEmailInput(e.target.value)}
                placeholder="email@example.com, another@example.com"
                className="mt-1.5"
              />
              <p className="text-xs text-gray-400 mt-1">
                Comma-separated. Receive an email on each form submission.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Response Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Response Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Maximum Responses</Label>
              <Input
                type="number"
                value={settings.responseLimit ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    responseLimit: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
                placeholder="Unlimited"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Close Date</Label>
              <Input
                type="datetime-local"
                value={settings.closeDate ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    closeDate: e.target.value || undefined,
                  }))
                }
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submission Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Success Message</Label>
              <Textarea
                value={settings.successMessage ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    successMessage: e.target.value || undefined,
                  }))
                }
                placeholder="Thank you for your response!"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Redirect URL (after submission)</Label>
              <Input
                value={settings.redirectUrl ?? ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    redirectUrl: e.target.value || undefined,
                  }))
                }
                placeholder="https://example.com/thank-you"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>GDPR Consent</Label>
                <p className="text-xs text-gray-400">Show data processing consent checkbox</p>
              </div>
              <button
                role="switch"
                aria-checked={settings.gdprConsentEnabled ?? false}
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    gdprConsentEnabled: !s.gdprConsentEnabled,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.gdprConsentEnabled ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.gdprConsentEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Form Status */}
        <Card>
          <CardHeader>
            <CardTitle>Form Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Current status: <strong>{form.status}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              {form.status === "draft" && (
                <Button
                  onClick={async () => {
                    try {
                      await publishMutation.mutateAsync({ id: formId });
                      formQuery.refetch();
                      toast({ title: "Form published!", variant: "success" });
                    } catch (err: any) {
                      toast({
                        title: "Publish failed",
                        description: err?.message,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Publish
                </Button>
              )}
              {form.status === "published" && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    await closeMutation.mutateAsync({ id: formId });
                    formQuery.refetch();
                    toast({ title: "Form closed", variant: "default" });
                  }}
                >
                  Close Form
                </Button>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Share Link</p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/f/${form.slug}`}
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/f/${form.slug}`
                    );
                    toast({ title: "Link copied!", variant: "success" });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              Permanently delete this form and all its responses. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirm("Are you sure? This cannot be undone.")) return;
                await deleteMutation.mutateAsync({ id: formId });
                window.location.href = "/";
              }}
            >
              Delete Form
            </Button>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
