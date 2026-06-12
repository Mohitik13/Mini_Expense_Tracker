const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readExpenses, writeExpenses } = require("../services/storage");

const router = express.Router();

const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// ── Validation helper ──────────────────────────────────────────────────────
function validateExpense(body) {
  const errors = [];
  const { amount, category, date } = body;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push("Amount must be a positive number.");
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category is required and must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  }

  if (!date) {
    errors.push("Date is required.");
  } else {
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(expenseDate.getTime())) {
      errors.push("Date is invalid.");
    } else if (expenseDate > today) {
      errors.push("Date cannot be in the future.");
    }
  }

  return errors;
}

// ── GET /api/expenses ──────────────────────────────────────────────────────
// Query params: category, startDate, endDate
router.get("/", (req, res) => {
  try {
    let expenses = readExpenses();
    const { category, startDate, endDate } = req.query;

    if (category && category !== "All") {
      expenses = expenses.filter((e) => e.category === category);
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      expenses = expenses.filter((e) => new Date(e.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      expenses = expenses.filter((e) => new Date(e.date) <= end);
    }

    // Sort newest first
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses." });
  }
});

// ── GET /api/expenses/summary ──────────────────────────────────────────────
router.get("/summary", (req, res) => {
  try {
    const allExpenses = readExpenses();
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthExpenses = allExpenses.filter(
      (e) => new Date(e.date) >= firstOfMonth
    );

    const totalThisMonth = thisMonthExpenses.reduce(
      (sum, e) => sum + e.amount, 0
    );

    const perCategory = {};
    VALID_CATEGORIES.forEach((cat) => (perCategory[cat] = 0));
    thisMonthExpenses.forEach((e) => {
      perCategory[e.category] = (perCategory[e.category] || 0) + e.amount;
    });

    const highest = thisMonthExpenses.reduce(
      (max, e) => (e.amount > (max?.amount || 0) ? e : max),
      null
    );

    res.json({ totalThisMonth, perCategory, highest });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute summary." });
  }
});

// ── POST /api/expenses ─────────────────────────────────────────────────────
router.post("/", (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const expenses = readExpenses();
    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(req.body.amount),
      category: req.body.category,
      date: req.body.date,
      note: req.body.note?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    writeExpenses(expenses);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to create expense." });
  }
});

// ── PUT /api/expenses/:id ──────────────────────────────────────────────────
router.put("/:id", (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const expenses = readExpenses();
    const idx = expenses.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Expense not found." });

    expenses[idx] = {
      ...expenses[idx],
      amount: parseFloat(req.body.amount),
      category: req.body.category,
      date: req.body.date,
      note: req.body.note?.trim() || "",
      updatedAt: new Date().toISOString(),
    };

    writeExpenses(expenses);
    res.json(expenses[idx]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense." });
  }
});

// ── DELETE /api/expenses/:id ───────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    const expenses = readExpenses();
    const filtered = expenses.filter((e) => e.id !== req.params.id);
    if (filtered.length === expenses.length) {
      return res.status(404).json({ error: "Expense not found." });
    }
    writeExpenses(filtered);
    res.json({ message: "Expense deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense." });
  }
});

module.exports = router;
