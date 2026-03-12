"use client";

import { use, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatSeconds } from "@/lib/utils";

export default function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: formId } = use(params);
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const formQuery = trpc.form.getById.useQuery({ id: formId });
  const fieldsQuery = trpc.field.list.useQuery({ formId });
  const statsQuery = trpc.response.stats.useQuery({ formId });
  const responsesQuery = trpc.response.list.useQuery({
    formId,
    page,
    pageSize: 25,
    status: statusFilter ? (statusFilter as any) : undefined,
  });

  const bulkUpdateMutation = trpc.response.bulkUpdateStatus.useMutation();
  const exportCsvMutation = trpc.response.exportCsv.useMutation();

  const handleBulkAction = async (status: "read" | "starred" | "archived") => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateMutation.mutateAsync({
        formId,
        responseIds: Array.from(selectedIds),
        status,
      });
      setSelectedIds(new Set());
      responsesQuery.refetch();
      statsQuery.refetch();
      toast({ title: "Updated", variant: "success" });
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const handleExportCsv = async () => {
    try {
      const { csv } = await exportCsvMutation.mutateAsync({ formId });
      if (!csv) {
        toast({ title: "No data to export", variant: "default" });
        return;
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formQuery.data?.title ?? "responses"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!responsesQuery.data) return;
    const allIds = responsesQuery.data.responses.map((r) => r.id);
    if (selectedIds.size === allIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const stats = statsQuery.data;
  const fields = fieldsQuery.data ?? [];
  const displayFields = fields.slice(0, 4); // Show first 4 fields as columns

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/forms/${formId}/edit`} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {formQuery.data?.title ?? "Responses"}
            </h1>
          </div>
          <p className="text-gray-500 text-sm">View and manage form submissions</p>
        </div>
        <Button variant="outline" onClick={handleExportCsv}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">New</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.new}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Avg Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgCompletionTime ? formatSeconds(stats.avgCompletionTime) : "--"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & bulk actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-36"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="starred">Starred</option>
            <option value="archived">Archived</option>
          </Select>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
              <Button size="sm" variant="ghost" onClick={() => handleBulkAction("read")}>
                Mark Read
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleBulkAction("starred")}>
                Star
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleBulkAction("archived")}>
                Archive
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 p-3">
                  <input
                    type="checkbox"
                    checked={
                      responsesQuery.data
                        ? selectedIds.size === responsesQuery.data.responses.length &&
                          responsesQuery.data.responses.length > 0
                        : false
                    }
                    onChange={toggleAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="p-3 text-left font-medium text-gray-600">Status</th>
                {displayFields.map((f) => (
                  <th key={f.id} className="p-3 text-left font-medium text-gray-600 truncate max-w-[200px]">
                    {f.label}
                  </th>
                ))}
                <th className="p-3 text-left font-medium text-gray-600">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {responsesQuery.data?.responses.map((response) => {
                const frMap = new Map(
                  response.fieldResponses.map((fr) => [fr.fieldId, fr.value])
                );

                return (
                  <tr
                    key={response.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(response.id)}
                        onChange={() => toggleSelect(response.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          response.status === "new"
                            ? "default"
                            : response.status === "starred"
                            ? "warning"
                            : response.status === "archived"
                            ? "outline"
                            : "success"
                        }
                      >
                        {response.status}
                      </Badge>
                    </td>
                    {displayFields.map((f) => (
                      <td key={f.id} className="p-3 truncate max-w-[200px] text-gray-700">
                        <Link
                          href={`/forms/${formId}/responses/${response.id}`}
                          className="hover:text-indigo-600"
                        >
                          {frMap.get(f.id) ?? "--"}
                        </Link>
                      </td>
                    ))}
                    <td className="p-3 text-gray-500 text-xs whitespace-nowrap">
                      <Link href={`/forms/${formId}/responses/${response.id}`}>
                        {formatDate(response.submittedAt)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {responsesQuery.data?.responses.length === 0 && (
                <tr>
                  <td
                    colSpan={displayFields.length + 3}
                    className="p-8 text-center text-gray-400"
                  >
                    No responses yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {responsesQuery.data && responsesQuery.data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {responsesQuery.data.page} of {responsesQuery.data.totalPages} ({responsesQuery.data.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= responsesQuery.data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
