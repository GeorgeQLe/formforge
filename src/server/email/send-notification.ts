import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationEmailParams {
  to: string[];
  formTitle: string;
  responseId: string;
  fieldValues: { label: string; value: string }[];
  dashboardUrl: string;
}

export async function sendNotificationEmail(params: NotificationEmailParams) {
  const { to, formTitle, responseId, fieldValues, dashboardUrl } = params;

  const fieldsHtml = fieldValues
    .map(
      (f) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#374151;vertical-align:top;width:35%">${escapeHtml(f.label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#6b7280">${escapeHtml(f.value) || "<em>No answer</em>"}</td>
        </tr>`
    )
    .join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">New Form Response</h1>
        <p style="color:#e0e7ff;margin:4px 0 0;font-size:14px">${escapeHtml(formTitle)}</p>
      </div>
      <div style="background:#fff;padding:24px 32px;border:1px solid #e5e7eb;border-top:none">
        <table style="width:100%;border-collapse:collapse">
          ${fieldsHtml}
        </table>
        <div style="margin-top:24px;text-align:center">
          <a href="${dashboardUrl}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View Response</a>
        </div>
      </div>
      <div style="padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px;border-radius:0 0 12px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none">
        Sent by FormForge
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "FormForge <notifications@formforge.app>",
    to,
    subject: `New response: ${formTitle}`,
    html,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
