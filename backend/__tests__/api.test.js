const request = require("supertest");
const app = require("../server");
const { writeExpenses, writeBudgets } = require("../services/storage");

// Reset data before each test
beforeEach(() => {
  writeExpenses([]);
  writeBudgets({});
});

describe("Expense API", () => {
  const validExpense = {
    amount: 250,
    category: "Food",
    date: "2025-01-15",
    note: "Lunch",
  };

  test("POST /api/expenses - creates a valid expense", async () => {
    const res = await request(app).post("/api/expenses").send(validExpense);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      amount: 250,
      category: "Food",
      date: "2025-01-15",
      note: "Lunch",
    });
    expect(res.body.id).toBeDefined();
  });

  test("POST /api/expenses - rejects negative amount", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ ...validExpense, amount: -50 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test("POST /api/expenses - rejects missing category", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ ...validExpense, category: "" });
    expect(res.status).toBe(400);
  });

  test("POST /api/expenses - rejects future date", async () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const res = await request(app)
      .post("/api/expenses")
      .send({ ...validExpense, date: future.toISOString().split("T")[0] });
    expect(res.status).toBe(400);
  });

  test("GET /api/expenses - returns empty array initially", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("GET /api/expenses - filters by category", async () => {
    await request(app).post("/api/expenses").send(validExpense);
    await request(app)
      .post("/api/expenses")
      .send({ ...validExpense, category: "Transport" });

    const res = await request(app).get("/api/expenses?category=Food");
    expect(res.status).toBe(200);
    expect(res.body.every((e) => e.category === "Food")).toBe(true);
  });

  test("PUT /api/expenses/:id - updates an expense", async () => {
    const create = await request(app).post("/api/expenses").send(validExpense);
    const id = create.body.id;

    const res = await request(app)
      .put(`/api/expenses/${id}`)
      .send({ ...validExpense, amount: 500, note: "Dinner" });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(500);
    expect(res.body.note).toBe("Dinner");
  });

  test("DELETE /api/expenses/:id - deletes an expense", async () => {
    const create = await request(app).post("/api/expenses").send(validExpense);
    const id = create.body.id;

    const del = await request(app).delete(`/api/expenses/${id}`);
    expect(del.status).toBe(200);

    const all = await request(app).get("/api/expenses");
    expect(all.body).toHaveLength(0);
  });

  test("DELETE /api/expenses/:id - 404 for unknown id", async () => {
    const res = await request(app).delete("/api/expenses/nonexistent-id");
    expect(res.status).toBe(404);
  });

  test("GET /api/expenses/summary - returns correct totals", async () => {
    const today = new Date().toISOString().split("T")[0];
    await request(app)
      .post("/api/expenses")
      .send({ ...validExpense, date: today, amount: 300 });
    await request(app)
      .post("/api/expenses")
      .send({ ...validExpense, date: today, amount: 700, category: "Bills" });

    const res = await request(app).get("/api/expenses/summary");
    expect(res.status).toBe(200);
    expect(res.body.totalThisMonth).toBe(1000);
    expect(res.body.perCategory.Food).toBe(300);
    expect(res.body.perCategory.Bills).toBe(700);
    expect(res.body.highest.amount).toBe(700);
  });
});

describe("Budget API", () => {
  test("GET /api/budgets - returns empty object initially", async () => {
    const res = await request(app).get("/api/budgets");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });

  test("PUT /api/budgets - saves budgets", async () => {
    const res = await request(app)
      .put("/api/budgets")
      .send({ Food: 5000, Transport: 2000 });
    expect(res.status).toBe(200);
    expect(res.body.Food).toBe(5000);
  });

  test("PUT /api/budgets - rejects negative budget", async () => {
    const res = await request(app)
      .put("/api/budgets")
      .send({ Food: -100 });
    expect(res.status).toBe(400);
  });
});
