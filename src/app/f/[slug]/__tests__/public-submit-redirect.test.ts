import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(__dirname, "../client.tsx"), "utf-8");
const rendererSource = readFileSync(
  resolve(__dirname, "../../../../components/form-renderer/form-renderer.tsx"),
  "utf-8"
);

describe("public submit redirect wiring", () => {
  it("redirects only when a successful submission response includes a redirect URL", () => {
    expect(clientSource).toContain("data.redirectUrl");
    expect(clientSource).toContain("window.location.href = data.redirectUrl");
    expect(clientSource).toContain("onSubmitSuccess={handleSubmitSuccess}");
  });

  it("passes success message and redirect URL from the renderer to the public client", () => {
    expect(rendererSource).toContain(
      "onSubmitSuccess?.({ message: data.message, redirectUrl: data.redirectUrl })"
    );
    expect(rendererSource).toContain(
      "setSubmitResult({ success: true, message: data.message })"
    );
  });
});
