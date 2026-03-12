"use client";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useEditor } from "./editor-provider";
import { SortableField } from "./sortable-field";
import { FIELD_TYPES, type FieldType } from "@/lib/field-types";
import { trpc } from "@/lib/trpc/client";

export function EditorCanvas() {
  const { state, dispatch } = useEditor();
  const [activeId, setActiveId] = useState<string | null>(null);
  const createFieldMutation = trpc.field.create.useMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // Handle drop from palette (new field)
    const data = active.data.current as { type?: FieldType; fromPalette?: boolean } | undefined;
    if (data?.fromPalette && data.type && state.form) {
      const fieldType = data.type;
      const fieldMeta = FIELD_TYPES[fieldType];

      try {
        const created = await createFieldMutation.mutateAsync({
          formId: state.form.id,
          type: fieldType,
          label: fieldMeta.label,
          required: false,
          sortOrder: state.fields.length,
        });

        dispatch({ type: "ADD_FIELD", field: created });
      } catch (error) {
        console.error("Failed to create field:", error);
      }
      return;
    }

    // Handle reorder
    if (active.id !== over.id) {
      const oldIndex = state.fields.findIndex((f) => f.id === active.id);
      const newIndex = state.fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFieldIds = [...state.fields.map((f) => f.id)];
        const [moved] = newFieldIds.splice(oldIndex, 1);
        newFieldIds.splice(newIndex, 0, moved!);
        dispatch({ type: "REORDER_FIELDS", fieldIds: newFieldIds });
      }
    }
  };

  const fieldIds = state.fields.map((f) => f.id);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
          <div className="max-w-2xl mx-auto space-y-3">
            {state.fields.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="text-gray-500 font-medium">
                  Drag fields from the palette or click to add
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Your form fields will appear here
                </p>
              </div>
            )}

            {state.fields.map((field) => (
              <SortableField key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="bg-white border-2 border-indigo-500 rounded-lg p-4 shadow-lg opacity-90">
              <span className="text-sm font-medium text-gray-700">
                Moving field...
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
