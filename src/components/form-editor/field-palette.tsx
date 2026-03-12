"use client";

import { useDraggable } from "@dnd-kit/core";
import { FIELD_TYPES, FIELD_CATEGORIES, type FieldType } from "@/lib/field-types";
import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  CheckSquare,
  Calendar,
  Star,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  CheckSquare,
  Calendar,
  Star,
  Upload,
};

function DraggableFieldType({ type }: { type: FieldType }) {
  const fieldDef = FIELD_TYPES[type];
  const Icon = ICON_MAP[fieldDef.icon] ?? Type;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Icon className="w-4 h-4 text-gray-400" />
      <span>{fieldDef.label}</span>
    </button>
  );
}

export function FieldPalette() {
  return (
    <div className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Field Types
      </h3>
      {Object.entries(FIELD_CATEGORIES).map(([key, category]) => (
        <div key={key} className="mb-5">
          <p className="text-xs font-medium text-gray-500 mb-2">
            {category.label}
          </p>
          <div className="space-y-1.5">
            {category.types.map((type) => (
              <DraggableFieldType key={type} type={type} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
