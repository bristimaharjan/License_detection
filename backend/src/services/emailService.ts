import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env from backend root explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ── Configure transporter (lazy so env vars are loaded) ────────────
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";
    console.log(`📧 SMTP config: user=${user}, pass=${pass ? "****" + pass.slice(-4) : "(empty)"}`);
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transporter;
}

// ── Fine notification email ────────────────────────────────────────
export async function sendFineEmail(data: {
  ownerName: string;
  ownerEmail: string;
  plateNumber: string;
  vehicleDesc: string;
  reason: string;
  amount: string;
  notes: string;
  officerDate: string;
}) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Traffic Violation Notice</h1>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">Nepal Traffic Police — Automated Citation</p>
      </div>
      <div style="padding: 24px;">
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Dear <strong>${data.ownerName}</strong>,
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          A traffic fine has been issued against your vehicle. Please find the details below:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; width: 140px;">Plate Number</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px; font-weight: 600;">${data.plateNumber}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Vehicle</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${data.vehicleDesc}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Violation</td>
            <td style="padding: 12px 16px; color: #dc2626; font-size: 14px; font-weight: 600;">${data.reason}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Fine Amount</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 18px; font-weight: 700;">NPR ${data.amount}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Date Issued</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${data.officerDate}</td>
          </tr>
        </table>

        ${data.notes ? `<p style="color: #475569; font-size: 13px; background: #fff7ed; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px;"><strong>Officer Notes:</strong> ${data.notes}</p>` : ""}

        <p style="color: #475569; font-size: 13px; line-height: 1.6; margin-top: 20px;">
          Please pay this fine within <strong>30 days</strong> to avoid additional penalties. You may visit any nearby traffic police office or pay online.
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <span style="display: inline-block; background: #dc2626; color: #ffffff; padding: 10px 28px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none;">
            Citation Reference: FINE-${Date.now().toString(36).toUpperCase()}
          </span>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 16px 24px; text-align: center;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          This is an automated notification from PlateDetect LPR System.<br>
          Nepal Traffic Police Department · ${new Date().getFullYear()}
        </p>
      </div>
    </div>
  `;

  return getTransporter().sendMail({
    from: `"PlateDetect LPR" <${process.env.SMTP_USER}>`,
    to: data.ownerEmail,
    subject: `Traffic Fine: ${data.reason} - ${data.plateNumber}`,
    html,
  });
}

// ── Flag notification email ────────────────────────────────────────
export async function sendFlagEmail(data: {
  ownerName: string;
  ownerEmail: string;
  plateNumber: string;
  vehicleDesc: string;
  reason: string;
  notes: string;
  officerDate: string;
}) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🚨 Vehicle Flagged Alert</h1>
        <p style="color: #fecaca; margin: 8px 0 0; font-size: 13px;">Nepal Traffic Police — System Alert</p>
      </div>
      <div style="padding: 24px;">
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Dear <strong>${data.ownerName}</strong>,
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Your vehicle has been <strong style="color: #dc2626;">flagged</strong> in the national vehicle registry. Details:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #fecaca;">
          <tr style="border-bottom: 1px solid #fef2f2;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; width: 140px;">Plate Number</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px; font-weight: 600;">${data.plateNumber}</td>
          </tr>
          <tr style="border-bottom: 1px solid #fef2f2;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Vehicle</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${data.vehicleDesc}</td>
          </tr>
          <tr style="border-bottom: 1px solid #fef2f2;">
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Flag Reason</td>
            <td style="padding: 12px 16px; color: #dc2626; font-size: 14px; font-weight: 600;">${data.reason}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px;">Date Flagged</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px;">${data.officerDate}</td>
          </tr>
        </table>

        ${data.notes ? `<p style="color: #475569; font-size: 13px; background: #fef2f2; border-left: 3px solid #dc2626; padding: 12px 16px; border-radius: 4px;"><strong>Details:</strong> ${data.notes}</p>` : ""}

        <p style="color: #475569; font-size: 13px; line-height: 1.6; margin-top: 20px;">
          If you believe this is an error, please contact your nearest traffic police station immediately with valid documentation.
        </p>
      </div>
      <div style="background: #fef2f2; padding: 16px 24px; text-align: center;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          This is an automated notification from PlateDetect LPR System.<br>
          Nepal Traffic Police Department · ${new Date().getFullYear()}
        </p>
      </div>
    </div>
  `;

  return getTransporter().sendMail({
    from: `"PlateDetect LPR" <${process.env.SMTP_USER}>`,
    to: data.ownerEmail,
    subject: `Vehicle Flagged: ${data.reason} - ${data.plateNumber}`,
    html,
  });
}
