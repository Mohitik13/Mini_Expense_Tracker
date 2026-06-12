const BASE = "/api";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data.errors?.join(" ") || data.error || "Something went wrong.";
    throw new Error(msg);
  }
  return data;
}

// ── Expenses ───────────────────────────────────────────────────────────────
export async function fetchExpenses(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "All")
    params.set("category", filters.category);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  const qs = params.toString();
  const res = await fetch(`${BASE}/expenses${qs ? `?${qs}` : ""}`);
  return handleResponse(res);
}

export async function fetchSummary() {
  const res = await fetch(`${BASE}/expenses/summary`);
  return handleResponse(res);
}

export async function createExpense(expense) {
  const res = await fetch(`${BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function updateExpense(id, expense) {
  const res = await fetch(`${BASE}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE}/expenses/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// ── Budgets ────────────────────────────────────────────────────────────────
export async function fetchBudgets() {
  const res = await fetch(`${BASE}/budgets`);
  return handleResponse(res);
}

export async function saveBudgets(budgets) {
  const res = await fetch(`${BASE}/budgets`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budgets),
  });
  return handleResponse(res);
}
