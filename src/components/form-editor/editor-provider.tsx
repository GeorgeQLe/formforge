"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import { trpc } from "@/lib/trpc/client";
import type { formFields, forms } from "@/server/db/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type FormField = typeof formFields.$inferSelect;
type Form = typeof forms.$inferSelect;

export interface EditorState {
  form: Form | null;
  fields: FormField[];
  selectedFieldId: string | null;
  isDirty: boolean;
  history: FormField[][];
  historyIndex: number;
}

type EditorAction =
  | { type: "SET_FORM"; form: Form; fields: FormField[] }
  | { type: "SELECT_FIELD"; fieldId: string | null }
  | { type: "ADD_FIELD"; field: FormField }
  | { type: "UPDATE_FIELD"; fieldId: string; updates: Partial<FormField> }
  | { type: "DELETE_FIELD"; fieldId: string }
  | { type: "REORDER_FIELDS"; fieldIds: string[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "MARK_CLEAN" };

const MAX_HISTORY = 50;

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function pushHistory(state: EditorState, newFields: FormField[]): EditorState {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(newFields);
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return {
    ...state,
    fields: newFields,
    isDirty: true,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_FORM":
      return {
        ...state,
        form: action.form,
        fields: action.fields,
        isDirty: false,
        history: [action.fields],
        historyIndex: 0,
        selectedFieldId: null,
      };

    case "SELECT_FIELD":
      return { ...state, selectedFieldId: action.fieldId };

    case "ADD_FIELD": {
      const newFields = [...state.fields, action.field];
      return {
        ...pushHistory(state, newFields),
        selectedFieldId: action.field.id,
      };
    }

    case "UPDATE_FIELD": {
      const newFields = state.fields.map((f) =>
        f.id === action.fieldId ? { ...f, ...action.updates } : f
      );
      return pushHistory(state, newFields);
    }

    case "DELETE_FIELD": {
      const newFields = state.fields.filter((f) => f.id !== action.fieldId);
      const selectedFieldId =
        state.selectedFieldId === action.fieldId ? null : state.selectedFieldId;
      return { ...pushHistory(state, newFields), selectedFieldId };
    }

    case "REORDER_FIELDS": {
      const fieldMap = new Map(state.fields.map((f) => [f.id, f]));
      const reordered = action.fieldIds
        .map((id, index) => {
          const field = fieldMap.get(id);
          return field ? { ...field, sortOrder: index } : null;
        })
        .filter(Boolean) as FormField[];
      return pushHistory(state, reordered);
    }

    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        fields: state.history[newIndex]!,
        historyIndex: newIndex,
        isDirty: true,
      };
    }

    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        fields: state.history[newIndex]!,
        historyIndex: newIndex,
        isDirty: true,
      };
    }

    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface EditorContextValue {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  saveForm: () => void;
}

const EditorContext = createContext<EditorContextValue>(null as any);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
const initialState: EditorState = {
  form: null,
  fields: [],
  selectedFieldId: null,
  isDirty: false,
  history: [[]],
  historyIndex: 0,
};

export function EditorProvider({
  children,
  formId,
}: {
  children: ReactNode;
  formId: string;
}) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formQuery = trpc.form.getById.useQuery({ id: formId });
  const fieldsQuery = trpc.field.list.useQuery({ formId });
  const updateFormMutation = trpc.form.update.useMutation();
  const createFieldMutation = trpc.field.create.useMutation();
  const updateFieldMutation = trpc.field.update.useMutation();
  const deleteFieldMutation = trpc.field.delete.useMutation();
  const reorderFieldsMutation = trpc.field.reorder.useMutation();

  // Load form data
  useEffect(() => {
    if (formQuery.data && fieldsQuery.data) {
      dispatch({
        type: "SET_FORM",
        form: formQuery.data,
        fields: fieldsQuery.data,
      });
    }
  }, [formQuery.data, fieldsQuery.data]);

  // Auto-save with debounce
  const saveForm = useCallback(() => {
    if (!state.form || !state.isDirty) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        // Sync field order
        const fieldIds = state.fields.map((f) => f.id);
        await reorderFieldsMutation.mutateAsync({
          formId: state.form!.id,
          fieldIds,
        });

        // Update each changed field
        for (const field of state.fields) {
          await updateFieldMutation.mutateAsync({
            id: field.id,
            formId: state.form!.id,
            type: field.type as any,
            label: field.label,
            placeholder: field.placeholder ?? undefined,
            helpText: field.helpText ?? undefined,
            required: field.required,
            options: field.options ?? undefined,
            validation: field.validation ?? undefined,
            conditionalLogic: field.conditionalLogic ?? undefined,
            sortOrder: field.sortOrder,
          });
        }

        dispatch({ type: "MARK_CLEAN" });
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 500);
  }, [state.form, state.fields, state.isDirty, updateFieldMutation, reorderFieldsMutation]);

  // Trigger auto-save when dirty
  useEffect(() => {
    if (state.isDirty) {
      saveForm();
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.isDirty, saveForm]);

  return (
    <EditorContext.Provider value={{ state, dispatch, saveForm }}>
      {children}
    </EditorContext.Provider>
  );
}
