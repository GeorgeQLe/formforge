"use client";

import { useMemo, useState } from "react";
import {
  Braces,
  Check,
  Code2,
  Copy,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  API_EXAMPLES,
  buildCurlExample,
  buildKeyPrefix,
  buildResponsePreview,
  DEFERRED_API_INFRASTRUCTURE,
  describeScopes,
  maskApiKey,
  PROTOTYPE_API_KEYS,
  SCOPE_LABELS,
  SCOPE_SUMMARIES,
  type ApiExample,
  type ApiScope,
} from "./api-access-prototype";

const allScopes = Object.keys(SCOPE_LABELS) as ApiScope[];

export default function ApiAccessExperimentPage() {
  const [keyName, setKeyName] = useState("Partner integration");
  const [keyMode, setKeyMode] = useState<"test" | "live">("test");
  const [selectedScopes, setSelectedScopes] = useState<ApiScope[]>(["forms:read", "responses:read"]);
  const [selectedExamplePath, setSelectedExamplePath] = useState(API_EXAMPLES[0].path);
  const [recentAction, setRecentAction] = useState("Key and scope changes stay local to this prototype.");

  const selectedExample =
    API_EXAMPLES.find((example) => example.path === selectedExamplePath) ?? API_EXAMPLES[0];
  const keyPrefix = buildKeyPrefix(keyName, keyMode);
  const maskedKey = maskApiKey(keyPrefix);
  const canRunExample = selectedScopes.includes(selectedExample.scope);

  const requestPreview = useMemo(
    () => buildCurlExample(selectedExample, maskedKey),
    [maskedKey, selectedExample]
  );
  const responsePreview = canRunExample
    ? buildResponsePreview(selectedExample)
    : JSON.stringify(
        {
          error: {
            code: "missing_scope",
            message: `This key needs ${selectedExample.scope}.`,
          },
        },
        null,
        2
      );

  const toggleScope = (scope: ApiScope) => {
    setSelectedScopes((current) =>
      current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope]
    );
  };

  const resetDraft = () => {
    setKeyName("Partner integration");
    setKeyMode("test");
    setSelectedScopes(["forms:read", "responses:read"]);
    setSelectedExamplePath(API_EXAMPLES[0].path);
    setRecentAction("Reset the local key draft and examples.");
  };

  const previewCreateKey = () => {
    setRecentAction(`Previewed ${keyMode} key with ${describeScopes(selectedScopes).toLowerCase()}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Badge variant="outline" className="mb-3">
            Prototype
          </Badge>
          <h1 className="text-2xl font-bold text-gray-900">API Access</h1>
          <p className="mt-1 max-w-3xl text-gray-500">
            Calibrate the developer workflow, key model, scopes, and public response contract before adding
            production API infrastructure.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[480px]">
          {[
            ["Keys", PROTOTYPE_API_KEYS.length.toString()],
            ["Scopes", allScopes.length.toString()],
            ["Version", "v1"],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-600" />
                <CardTitle>API Key Draft</CardTitle>
              </div>
              <CardDescription>Preview creation, naming, mode, and scope choices with local state.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                <div>
                  <Label htmlFor="key-name">Key name</Label>
                  <Input
                    id="key-name"
                    value={keyName}
                    onChange={(event) => setKeyName(event.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="key-mode">Mode</Label>
                  <Select
                    id="key-mode"
                    value={keyMode}
                    onChange={(event) => setKeyMode(event.target.value as "test" | "live")}
                    className="mt-1"
                  >
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">One-time secret preview</p>
                <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <code className="break-all rounded bg-white px-3 py-2 text-sm text-gray-800">{maskedKey}</code>
                  <Button type="button" variant="outline" size="sm" onClick={previewCreateKey}>
                    <Copy className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Scopes</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {allScopes.map((scope) => {
                    const selected = selectedScopes.includes(scope);

                    return (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => toggleScope(scope)}
                        className={`rounded-lg border p-4 text-left transition-colors ${
                          selected
                            ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-medium">{SCOPE_LABELS[scope]}</span>
                          {selected && <Check className="h-4 w-4 text-indigo-600" />}
                        </span>
                        <span className="mt-2 block text-sm text-gray-500">{SCOPE_SUMMARIES[scope]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-600" />
                <CardTitle>Request Explorer</CardTitle>
              </div>
              <CardDescription>Try endpoint shape, required scope, and response/error semantics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-example">Endpoint</Label>
                <Select
                  id="api-example"
                  value={selectedExample.path}
                  onChange={(event) => setSelectedExamplePath(event.target.value)}
                  className="mt-1"
                >
                  {API_EXAMPLES.map((example) => (
                    <option key={`${example.method}-${example.path}`} value={example.path}>
                      {example.method} {example.path}
                    </option>
                  ))}
                </Select>
              </div>

              <EndpointSummary example={selectedExample} allowed={canRunExample} />

              <div className="grid gap-4 lg:grid-cols-2">
                <CodeBlock title="Request" value={requestPreview} />
                <CodeBlock title={canRunExample ? "Response" : "Error"} value={responsePreview} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-indigo-600" />
                <CardTitle>Existing Key Preview</CardTitle>
              </div>
              <CardDescription>Fixture keys for rotation, status, and last-used expectations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {PROTOTYPE_API_KEYS.map((apiKey) => (
                <div key={apiKey.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{apiKey.name}</p>
                      <p className="mt-1 break-all font-mono text-xs text-gray-500">
                        {maskApiKey(apiKey.prefix)}
                      </p>
                    </div>
                    <Badge variant={apiKey.status === "active" ? "success" : "outline"}>{apiKey.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{describeScopes(apiKey.scopes)}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    Created {apiKey.createdAt} · Last used {apiKey.lastUsed}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Braces className="h-5 w-5 text-indigo-600" />
                <CardTitle>Prototype State</CardTitle>
              </div>
              <CardDescription>Current local workflow signal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{recentAction}</p>
              <Button type="button" variant="outline" className="w-full" onClick={resetDraft}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Draft
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-indigo-600" />
                <CardTitle>Deferred Infrastructure</CardTitle>
              </div>
              <CardDescription>Evidence needed before promotion to production scope.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                {DEFERRED_API_INFRASTRUCTURE.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EndpointSummary({ example, allowed }: { example: ApiExample; allowed: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{example.method}</Badge>
        <p className="font-medium text-gray-900">{example.title}</p>
        <Badge variant={allowed ? "success" : "destructive"}>{example.scope}</Badge>
      </div>
      <p className="mt-2 text-sm text-gray-600">{example.description}</p>
    </div>
  );
}

function CodeBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">{title}</p>
      <pre className="min-h-[220px] overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs leading-6 text-gray-100">
        <code>{value}</code>
      </pre>
    </div>
  );
}
