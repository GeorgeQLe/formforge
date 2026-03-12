"use client";

import { use } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatSeconds } from "@/lib/utils";

export default function ResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const { id: formId, responseId } = use(params);
  const { toast } = useToast();

  const formQuery = trpc.form.getById.useQuery({ id: formId });
  const fieldsQuery = trpc.field.list.useQuery({ formId });
  const responseQuery = trpc.response.getById.useQuery({
    id: responseId,
    formId,
  });

  const updateStatusMutation = trpc.response.updateStatus.useMutation();

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: responseId,
        formId,
        status: status as any,
      });
      responseQuery.refetch();
      toast({ title: "Status updated", variant: "success" });
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const response = responseQuery.data;
  const form = formQuery.data;
  const fields = fieldsQuery.data ?? [];

  if (!response || !form) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Build initial values from field responses
  const initialValues: Record<string, string> = {};
  for (const fr of response.fieldResponses) {
    initialValues[fr.fieldId] = fr.value ?? "";
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/forms/${formId}/responses`}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Response Detail</h1>
            <p className="text-sm text-gray-500">{form.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={response.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-32"
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="starred">Starred</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </div>

      {/* Meta */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Submitted {formatDate(response.submittedAt)}
        </div>
        {response.completionTime && (
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Completed in {formatSeconds(response.completionTime)}
          </div>
        )}
        <Badge
          variant={
            response.status === "new"
              ? "default"
              : response.status === "starred"
              ? "warning"
              : "outline"
          }
        >
          {response.status}
        </Badge>
      </div>

      {/* Response data rendered in readonly form */}
      <Card>
        <CardContent className="p-6">
          <FormRenderer
            mode="readonly"
            form={form}
            fields={fields}
            initialValues={initialValues}
          />
        </CardContent>
      </Card>
    </div>
  );
}
