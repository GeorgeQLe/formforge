"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, FilePlus2, MessageSquareText } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: forms, isLoading } = trpc.form.list.useQuery();
  const duplicateMutation = trpc.form.duplicate.useMutation({
    onSuccess: async (form) => {
      await utils.form.list.invalidate();
      router.push(`/forms/${form.id}/edit`);
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Forms</h1>
          <p className="text-gray-500 mt-1">Create, manage, and track your forms</p>
        </div>
        <Link href="/forms/new">
          <Button>
            <FilePlus2 className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && forms?.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <FilePlus2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No forms yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first form with AI or from scratch.</p>
          <Link href="/forms/new">
            <Button>Create Your First Form</Button>
          </Link>
        </Card>
      )}

      {/* Forms grid */}
      {forms && forms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6">
                <Link href={`/forms/${form.id}/edit`} className="block">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">
                      {form.title}
                    </h3>
                    <Badge
                      variant={
                        form.status === "published"
                          ? "success"
                          : form.status === "closed"
                          ? "destructive"
                          : "outline"
                      }
                      className="ml-2 shrink-0"
                    >
                      {form.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquareText className="w-4 h-4" />
                      {form.responseCount} responses
                    </span>
                    <span>{formatDate(form.createdAt)}</span>
                  </div>
                </Link>
                <div className="mt-5 flex items-center justify-end border-t border-gray-100 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateMutation.mutate({ id: form.id })}
                    disabled={duplicateMutation.isPending}
                    title="Duplicate form"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
