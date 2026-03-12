"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditor } from "./editor-provider";
import { cn } from "@/lib/utils";
import { FIELD_TYPES } from "@/lib/field-types";
import type { formFields } from "@/server/db/schema";

type FormField = typeof formFields.$inferSelect;

export function SortableField({ field }: { field: FormField }) {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedFieldId === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldMeta = FIELD_TYPES[field.type as keyof typeof FIELD_TYPES];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-3 rounded-lg border-2 p-4 bg-white transition-all",
        isSelected
          ? "border-indigo-500 shadow-sm ring-2 ring-indigo-100"
          : "border-gray-200 hover:border-gray-300",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={() => dispatch({ type: "SELECT_FIELD", fieldId: field.id })}
    >
      {/* Drag handle */}
      <button
        className="mt-0.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>

      {/* Field content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 truncate">
            {field.label}
          </span>
          {field.required && (
            <span className="text-red-500 text-xs">*</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
            {fieldMeta?.label ?? field.type}
          </span>
          {field.conditionalLogic && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Conditional
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "DELETE_FIELD", fieldId: field.id });
        }}
        aria-label="Delete field"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}
