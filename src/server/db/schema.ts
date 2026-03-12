import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  email: text("email").notNull(),
  name: text("name"),
  plan: text("plan").default("free").notNull(), // free | pro | business
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
}));

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------
export type ThemeColors = {
  bg: string;
  text: string;
  primary: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  accent: string;
};

export const themes = pgTable("themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  isSystem: boolean("is_system").default(false).notNull(),
  colors: jsonb("colors").$type<ThemeColors>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const themesRelations = relations(themes, ({ many }) => ({
  forms: many(forms),
}));

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------
export type FormSettings = {
  notificationEmails?: string[];
  responseLimit?: number;
  closeDate?: string;
  redirectUrl?: string;
  successMessage?: string;
  gdprConsentEnabled?: boolean;
};

export const forms = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  slug: text("slug").unique().notNull(),
  status: text("status").default("draft").notNull(), // draft | published | closed
  settings: jsonb("settings").$type<FormSettings>().default({}).notNull(),
  themeId: uuid("theme_id").references(() => themes.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(users, { fields: [forms.userId], references: [users.id] }),
  theme: one(themes, { fields: [forms.themeId], references: [themes.id] }),
  fields: many(formFields),
  responses: many(formResponses),
}));

// ---------------------------------------------------------------------------
// Form Fields
// ---------------------------------------------------------------------------
export type FieldOption = { label: string; value: string };

export type FieldValidation = {
  min?: number;
  max?: number;
  pattern?: string;
  fileTypes?: string[];
  maxFileSize?: number; // bytes
};

export type ConditionalLogicCondition = {
  fieldId: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";
  value?: string;
};

export type ConditionalLogic = {
  showWhen: ConditionalLogicCondition[];
  logic: "AND" | "OR";
  action: "show" | "hide";
};

export const formFields = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .references(() => forms.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // text|email|number|dropdown|radio|checkbox|textarea|date|rating|file_upload
  label: text("label").notNull(),
  placeholder: text("placeholder"),
  helpText: text("help_text"),
  required: boolean("required").default(false).notNull(),
  options: jsonb("options").$type<FieldOption[]>(),
  validation: jsonb("validation").$type<FieldValidation>(),
  conditionalLogic: jsonb("conditional_logic").$type<ConditionalLogic>(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const formFieldsRelations = relations(formFields, ({ one, many }) => ({
  form: one(forms, { fields: [formFields.formId], references: [forms.id] }),
  fieldResponses: many(fieldResponses),
}));

// ---------------------------------------------------------------------------
// Form Responses
// ---------------------------------------------------------------------------
export const formResponses = pgTable("form_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .references(() => forms.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").default("new").notNull(), // new | read | starred | archived
  completionTime: integer("completion_time"), // seconds
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
});

export const formResponsesRelations = relations(formResponses, ({ one, many }) => ({
  form: one(forms, { fields: [formResponses.formId], references: [forms.id] }),
  fieldResponses: many(fieldResponses),
}));

// ---------------------------------------------------------------------------
// Field Responses
// ---------------------------------------------------------------------------
export const fieldResponses = pgTable("field_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  responseId: uuid("response_id")
    .references(() => formResponses.id, { onDelete: "cascade" })
    .notNull(),
  fieldId: uuid("field_id")
    .references(() => formFields.id, { onDelete: "set null" })
    .notNull(),
  fieldLabelSnapshot: text("field_label_snapshot").notNull(),
  value: text("value"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const fieldResponsesRelations = relations(fieldResponses, ({ one }) => ({
  response: one(formResponses, {
    fields: [fieldResponses.responseId],
    references: [formResponses.id],
  }),
  field: one(formFields, {
    fields: [fieldResponses.fieldId],
    references: [formFields.id],
  }),
}));
