"use client";

import { useState, useRef } from "react";
import type { FieldComponentProps } from "../form-renderer";

export function FileUploadField({ field, value, onChange, error, readonly }: FieldComponentProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");

    try {
      // Get presigned URL
      const res = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      const { presignedUrl, cdnUrl } = await res.json();

      // Upload directly to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload to storage failed");
      }

      setFileName(file.name);
      onChange(cdnUrl);
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.helpText && (
        <p className="text-xs text-gray-500 mb-1.5">{field.helpText}</p>
      )}

      {value ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-green-700 truncate flex-1">
            {fileName || "File uploaded"}
          </span>
          {!readonly && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setFileName("");
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !readonly && !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            readonly
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-indigo-400 cursor-pointer"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-6 w-6 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-gray-600 font-medium">
                Click to upload a file
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {field.validation?.fileTypes?.join(", ") || "All file types"} &bull;{" "}
                {field.validation?.maxFileSize
                  ? `Max ${Math.round(field.validation.maxFileSize / (1024 * 1024))}MB`
                  : "Max 10MB"}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={field.validation?.fileTypes?.map((t) => `.${t}`).join(",") || undefined}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={readonly || uploading}
      />

      {(error || uploadError) && (
        <p id={`${field.id}-error`} className="text-xs text-red-500 mt-1">
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
