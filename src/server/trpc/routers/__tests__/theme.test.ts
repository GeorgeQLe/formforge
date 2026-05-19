import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const routersDir = path.resolve(__dirname, "..");
const themeRouterSrc = fs.readFileSync(path.join(routersDir, "theme.ts"), "utf-8");
const appRouterSrc = fs.readFileSync(path.join(routersDir, "_app.ts"), "utf-8");
const schemaSrc = fs.readFileSync(
  path.resolve(__dirname, "../../../db/schema.ts"),
  "utf-8"
);
const themesPageSrc = fs.readFileSync(
  path.resolve(__dirname, "../../../../app/(dashboard)/themes/page.tsx"),
  "utf-8"
);
const sidebarSrc = fs.readFileSync(
  path.resolve(__dirname, "../../../../components/dashboard/sidebar.tsx"),
  "utf-8"
);

describe("theme router", () => {
  it("is registered on the app router", () => {
    expect(appRouterSrc).toContain("themeRouter");
    expect(appRouterSrc).toContain("theme: themeRouter");
  });

  it("adds nullable theme ownership for custom theme scoping", () => {
    expect(schemaSrc).toContain('userId: uuid("user_id").references');
    expect(schemaSrc).toContain("themes.userId");
  });

  it("keeps list visibility scoped to system themes and the current user", () => {
    expect(themeRouterSrc).toContain("visibleThemesWhere(ctx.user.id)");
    expect(themeRouterSrc).toContain("eq(themes.isSystem, true)");
    expect(themeRouterSrc).toContain("eq(themes.userId, userId)");
  });

  it("scopes custom theme mutations to the current user", () => {
    const customMutationGuards =
      themeRouterSrc.match(/and\(eq\(themes\.id, input\.id\), eq\(themes\.userId, ctx\.user\.id\)\)/g) ??
      [];

    expect(customMutationGuards.length).toBeGreaterThanOrEqual(3);
    expect(themeRouterSrc).toContain("userId: ctx.user.id");
    expect(themeRouterSrc).toContain("System themes cannot be edited");
    expect(themeRouterSrc).toContain("System themes cannot be deleted");
  });

  it("blocks deleting themes referenced by the user's forms", () => {
    expect(themeRouterSrc).toContain("eq(forms.userId, ctx.user.id)");
    expect(themeRouterSrc).toContain("eq(forms.themeId, input.id)");
    expect(themeRouterSrc).toContain('code: "CONFLICT"');
  });
});

describe("theme dashboard wiring", () => {
  it("exposes the dashboard route through navigation", () => {
    expect(sidebarSrc).toContain('href: "/themes"');
    expect(sidebarSrc).toContain("Palette");
  });

  it("uses the theme CRUD procedures and renders a preview", () => {
    expect(themesPageSrc).toContain("trpc.theme.list.useQuery");
    expect(themesPageSrc).toContain("trpc.theme.create.useMutation");
    expect(themesPageSrc).toContain("trpc.theme.update.useMutation");
    expect(themesPageSrc).toContain("trpc.theme.delete.useMutation");
    expect(themesPageSrc).toContain('data-testid="theme-preview"');
  });
});

