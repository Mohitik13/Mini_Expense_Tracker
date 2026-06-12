const express = require("express");
const { readBudgets, writeBudgets } = require("../services/storage");

const router = express.Router();

// ── GET /api/budgets ───────────────────────────────────────────────────────
router.get("/", (req, res) => {
  try {
    res.json(readBudgets());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets." });
  }
});

// ── PUT /api/budgets ───────────────────────────────────────────────────────
// Body: { Food: 5000, Transport: 2000, ... }
router.put("/", (req, res) => {
  try {
    const budgets = req.body;

    // Validate: all values must be non-negative numbers
    for (const [cat, val] of Object.entries(budgets)) {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        return res.status(400).json({
          error: `Budget for ${cat} must be a non-negative number.`,
        });
      }
      budgets[cat] = num;
    }

    writeBudgets(budgets);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to save budgets." });
  }
});

module.exports = router;
