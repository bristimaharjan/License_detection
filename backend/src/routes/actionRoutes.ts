import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendFineEmail, sendFlagEmail } from "../services/emailService.js";

const actionRoutes = Router();

// Demo recipient — all notifications go to this email for demo purposes
const DEMO_EMAIL = process.env.DEMO_EMAIL || "bristi.maharjan1010@gmail.com";

// Resolve CSV path
const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);
const CSV_PATH = path.resolve(__dirname2, "../../../data/vehicles.csv");

// ── CSV update helpers ─────────────────────────────────────────────

function readCSV(): string[][] {
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  // Parse CSV rows (handle quoted fields with commas)
  const rows: string[][] = [];
  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
        current += ch;
      } else if (ch === "," && !inQuotes) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current);
    rows.push(fields);
  }
  return rows;
}

function writeCSV(rows: string[][]): void {
  const content = rows.map((r) => r.join(",")).join("\r\n") + "\r\n";
  fs.writeFileSync(CSV_PATH, content, "utf-8");
}

function findPlateIndex(rows: string[][], plateNumber: string): number {
  const normalized = plateNumber.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  for (let i = 1; i < rows.length; i++) {
    const rowPlate = (rows[i][0] || "").replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (rowPlate === normalized) return i;
  }
  return -1;
}

// Column indices (matching CSV header order)
// plate_number(0), owner_name(1), address(2), vehicle_year(3), vehicle_make(4),
// vehicle_model(5), vehicle_color(6), reg_expiry(7), insurance(8),
// insurance_provider(9), policy_number(10), fines(11), fine_amount(12), is_flagged(13)

const COL = {
  FINES: 11,
  FINE_AMOUNT: 12,
  IS_FLAGGED: 13,
};

// ── POST /api/issue-fine ───────────────────────────────────────────
actionRoutes.post("/issue-fine", async (req: Request, res: Response) => {
  try {
    const { plate_number, owner_name, vehicle_year, vehicle_make, vehicle_model, reason, amount, notes } = req.body;

    if (!plate_number || !reason || !amount) {
      return res.status(400).json({ error: "plate_number, reason, and amount are required" });
    }

    const vehicleDesc = `${vehicle_year || ""} ${vehicle_make || ""} ${vehicle_model || ""}`.trim();

    await sendFineEmail({
      ownerName: owner_name || "Vehicle Owner",
      ownerEmail: DEMO_EMAIL,
      plateNumber: plate_number,
      vehicleDesc,
      reason,
      amount: String(amount),
      notes: notes || "",
      officerDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // ── Update CSV database ──
    try {
      const rows = readCSV();
      const idx = findPlateIndex(rows, plate_number);
      if (idx > 0) {
        const currentFines = parseInt(rows[idx][COL.FINES] || "0", 10);
        const currentAmount = parseInt(rows[idx][COL.FINE_AMOUNT] || "0", 10);
        rows[idx][COL.FINES] = String(currentFines + 1);
        rows[idx][COL.FINE_AMOUNT] = String(currentAmount + parseInt(amount, 10));
        writeCSV(rows);
        console.log(`📝 CSV updated: ${plate_number} → fines=${currentFines + 1}, amount=${currentAmount + parseInt(amount, 10)}`);
      }
    } catch (csvErr) {
      console.error("⚠ CSV update failed (email was sent):", csvErr);
    }

    console.log(`✅ Fine email sent to ${DEMO_EMAIL} for plate ${plate_number}`);
    return res.json({ success: true, message: `Fine notification sent to ${DEMO_EMAIL}` });
  } catch (err) {
    console.error("❌ Failed to send fine email:", err);
    return res.status(500).json({ error: "Failed to send email notification", details: String(err) });
  }
});

// ── POST /api/flag-vehicle ─────────────────────────────────────────
actionRoutes.post("/flag-vehicle", async (req: Request, res: Response) => {
  try {
    const { plate_number, owner_name, vehicle_year, vehicle_make, vehicle_model, reason, notes } = req.body;

    if (!plate_number || !reason) {
      return res.status(400).json({ error: "plate_number and reason are required" });
    }

    const vehicleDesc = `${vehicle_year || ""} ${vehicle_make || ""} ${vehicle_model || ""}`.trim();

    await sendFlagEmail({
      ownerName: owner_name || "Vehicle Owner",
      ownerEmail: DEMO_EMAIL,
      plateNumber: plate_number,
      vehicleDesc,
      reason,
      notes: notes || "",
      officerDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // ── Update CSV database ──
    try {
      const rows = readCSV();
      const idx = findPlateIndex(rows, plate_number);
      if (idx > 0) {
        rows[idx][COL.IS_FLAGGED] = "True";
        writeCSV(rows);
        console.log(`📝 CSV updated: ${plate_number} → is_flagged=True`);
      }
    } catch (csvErr) {
      console.error("⚠ CSV update failed (email was sent):", csvErr);
    }

    console.log(`✅ Flag email sent to ${DEMO_EMAIL} for plate ${plate_number}`);
    return res.json({ success: true, message: `Flag notification sent to ${DEMO_EMAIL}` });
  } catch (err) {
    console.error("❌ Failed to send flag email:", err);
    return res.status(500).json({ error: "Failed to send email notification", details: String(err) });
  }
});

export { actionRoutes };
