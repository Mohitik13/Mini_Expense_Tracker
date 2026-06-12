export const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

export const CATEGORY_COLORS = {
  Food: "#f472b6",
  Transport: "#38bdf8",
  Bills: "#f59e0b",
  Entertainment: "#a78bfa",
  Other: "#6ee7b7",
};

// ── Currency formatting ────────────────────────────────────────────────────
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Date helpers ───────────────────────────────────────────────────────────
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function getThisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export function getLastMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── CSV Export ─────────────────────────────────────────────────────────────
export function exportToCSV(expenses) {
  const header = ["Date", "Category", "Amount (₹)", "Note"];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    `"${(e.note || "").replace(/"/g, '""')}"`,
  ]);

  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses_${todayISO()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
