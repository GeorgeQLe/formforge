"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Copy, Plus, Save, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import type { ThemeColors, themes } from "@/server/db/schema";
import { defaultThemeColors } from "@/server/themes/validation";

type ThemeRecord = typeof themes.$inferSelect;

const colorFields: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: "bg", label: "Background" },
  { key: "text", label: "Text" },
  { key: "primary", label: "Primary" },
  { key: "border", label: "Border" },
  { key: "inputBg", label: "Input background" },
  { key: "inputBorder", label: "Input border" },
  { key: "accent", label: "Accent" },
];

function cloneColors(colors: ThemeColors): ThemeColors {
  return { ...colors };
}

export default function ThemesPage() {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const themesQuery = trpc.theme.list.useQuery();
  const createMutation = trpc.theme.create.useMutation();
  const updateMutation = trpc.theme.update.useMutation();
  const deleteMutation = trpc.theme.delete.useMutation();
  const [selectedId, setSelectedId] = useState<string | "new">("new");
  const [name, setName] = useState("Untitled theme");
  const [colors, setColors] = useState<ThemeColors>(defaultThemeColors);
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  const customThemes = themesQuery.data?.filter((theme) => !theme.isSystem) ?? [];
  const systemThemes = themesQuery.data?.filter((theme) => theme.isSystem) ?? [];
  const isNewTheme = selectedId === "new";

  const previewStyle = useMemo(
    () =>
      ({
        "--preview-bg": colors.bg,
        "--preview-text": colors.text,
        "--preview-primary": colors.primary,
        "--preview-border": colors.border,
        "--preview-input-bg": colors.inputBg,
        "--preview-input-border": colors.inputBorder,
        "--preview-accent": colors.accent,
      }) as CSSProperties,
    [colors]
  );

  const refreshThemes = async () => {
    await utils.theme.list.invalidate();
  };

  const handleDuplicate = (theme: ThemeRecord) => {
    setSelectedId("new");
    setIsSystemTheme(false);
    setName(`${theme.name} copy`);
    setColors(cloneColors(theme.colors));
  };

  const handleSelectTheme = (theme: ThemeRecord) => {
    setSelectedId(theme.id);
    setIsSystemTheme(theme.isSystem);
    setName(theme.name);
    setColors(cloneColors(theme.colors));
  };

  const handleNewTheme = () => {
    setSelectedId("new");
    setIsSystemTheme(false);
    setName("Untitled theme");
    setColors(defaultThemeColors);
  };

  const handleSave = async () => {
    try {
      if (isSystemTheme) {
        toast({ title: "System themes are read-only", variant: "destructive" });
        return;
      }

      const payload = { name, colors };
      const saved = isNewTheme
        ? await createMutation.mutateAsync(payload)
        : await updateMutation.mutateAsync({ id: selectedId, ...payload });

      setSelectedId(saved.id);
      await refreshThemes();
      toast({ title: "Theme saved", variant: "success" });
    } catch (error) {
      toast({
        title: "Failed to save theme",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (isNewTheme || isSystemTheme) return;
    if (!confirm("Delete this theme? Forms using it must be changed first.")) return;

    try {
      await deleteMutation.mutateAsync({ id: selectedId });
      setSelectedId("new");
      await refreshThemes();
      toast({ title: "Theme deleted", variant: "success" });
    } catch (error) {
      toast({
        title: "Failed to delete theme",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  if (themesQuery.isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-96 rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
          <p className="text-sm text-gray-500">
            Create reusable visual styles for public forms.
          </p>
        </div>
        <Button
          onClick={handleNewTheme}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Theme
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <ThemeList
            title="Custom"
            empty="No custom themes yet."
            themes={customThemes}
            selectedId={selectedId}
            onSelect={handleSelectTheme}
            onDuplicate={handleDuplicate}
          />
          <ThemeList
            title="System"
            empty="No system themes configured."
            themes={systemThemes}
            selectedId={selectedId}
            onSelect={handleSelectTheme}
            onDuplicate={handleDuplicate}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader>
              <CardTitle>{isNewTheme ? "Create theme" : "Edit theme"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSystemTheme}
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {colorFields.map((field) => (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        type="color"
                        value={colors[field.key]}
                        onChange={(event) =>
                          setColors((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        disabled={isSystemTheme}
                        className="h-10 w-14 shrink-0 p-1"
                      />
                      <Input
                        value={colors[field.key]}
                        onChange={(event) =>
                          setColors((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        disabled={isSystemTheme}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-between gap-3 border-t border-gray-100 pt-5">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isNewTheme || isSystemTheme || deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSystemTheme || createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Theme
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={previewStyle}
                className="rounded-lg border p-5"
                data-testid="theme-preview"
              >
                <div
                  className="rounded-lg border p-4"
                  style={{
                    background: "var(--preview-bg)",
                    borderColor: "var(--preview-border)",
                    color: "var(--preview-text)",
                  }}
                >
                  <h2 className="text-lg font-semibold">Contact request</h2>
                  <p className="mt-1 text-sm opacity-80">
                    A sample public form using this theme.
                  </p>
                  <label className="mt-4 block text-sm font-medium">Email</label>
                  <input
                    readOnly
                    value="alex@example.com"
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                    style={{
                      background: "var(--preview-input-bg)",
                      borderColor: "var(--preview-input-border)",
                      color: "var(--preview-text)",
                    }}
                  />
                  <button
                    className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white"
                    style={{ background: "var(--preview-primary)" }}
                  >
                    Submit
                  </button>
                  <div
                    className="mt-4 h-2 rounded-full"
                    style={{ background: "var(--preview-accent)" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ThemeList({
  title,
  empty,
  themes,
  selectedId,
  onSelect,
  onDuplicate,
}: {
  title: string;
  empty: string;
  themes: ThemeRecord[];
  selectedId: string | "new";
  onSelect: (theme: ThemeRecord) => void;
  onDuplicate: (theme: ThemeRecord) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {themes.length === 0 ? (
          <p className="text-sm text-gray-500">{empty}</p>
        ) : (
          themes.map((theme) => (
            <div
              key={theme.id}
              className={`rounded-lg border p-3 ${
                selectedId === theme.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 text-left"
                onClick={() => onSelect(theme)}
              >
                <span
                  className="h-9 w-9 shrink-0 rounded-md border"
                  style={{
                    background: theme.colors.bg,
                    borderColor: theme.colors.border,
                  }}
                >
                  <span
                    className="block h-full w-1/2 rounded-l-md"
                    style={{ background: theme.colors.primary }}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {theme.name}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {theme.isSystem ? "System theme" : "Custom theme"}
                  </span>
                </span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => onDuplicate(theme)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
