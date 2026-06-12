import { useState, useEffect, useCallback } from "react";
import {
  fetchExpenses,
  fetchSummary,
  fetchBudgets,
  createExpense,
  updateExpense,
  deleteExpense,
  saveBudgets,
} from "../utils/api";
import { getThisMonthRange } from "../utils/helpers";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [filters, setFilters] = useState({
    category: "All",
    datePreset: "thisMonth",
    ...getThisMonthRange(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Load expenses with current filters ──────────────────────────────────
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses({
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ── Load summary (always all of this month) ──────────────────────────────
  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      console.error("Summary fetch failed:", err.message);
    }
  }, []);

  // ── Load budgets ─────────────────────────────────────────────────────────
  const loadBudgets = useCallback(async () => {
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      console.error("Budgets fetch failed:", err.message);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    loadSummary();
    loadBudgets();
  }, [loadSummary, loadBudgets]);

  // ── CRUD actions ─────────────────────────────────────────────────────────
  const addExpense = async (expense) => {
    const created = await createExpense(expense);
    await loadExpenses();
    await loadSummary();
    return created;
  };

  const editExpense = async (id, expense) => {
    const updated = await updateExpense(id, expense);
    await loadExpenses();
    await loadSummary();
    return updated;
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    await loadExpenses();
    await loadSummary();
  };

  const updateBudgets = async (newBudgets) => {
    const saved = await saveBudgets(newBudgets);
    setBudgets(saved);
    return saved;
  };

  return {
    expenses,
    summary,
    budgets,
    filters,
    setFilters,
    loading,
    error,
    addExpense,
    editExpense,
    removeExpense,
    updateBudgets,
    refresh: loadExpenses,
  };
}
