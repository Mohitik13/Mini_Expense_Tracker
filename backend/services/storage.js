const fs = require("fs");
const path = require("path");

const EXPENSES_FILE = path.join(__dirname, "../data/expenses.json");
const BUDGETS_FILE = path.join(__dirname, "../data/budgets.json");

// ── Ensure data directory and files exist ──────────────────────────────────
function ensureFile(filePath, defaultValue) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

// ── Expenses ───────────────────────────────────────────────────────────────
function readExpenses() {
  ensureFile(EXPENSES_FILE, []);
  const raw = fs.readFileSync(EXPENSES_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeExpenses(expenses) {
  ensureFile(EXPENSES_FILE, []);
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
}

// ── Budgets ────────────────────────────────────────────────────────────────
function readBudgets() {
  ensureFile(BUDGETS_FILE, {});
  const raw = fs.readFileSync(BUDGETS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeBudgets(budgets) {
  ensureFile(BUDGETS_FILE, {});
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
}

module.exports = { readExpenses, writeExpenses, readBudgets, writeBudgets };
