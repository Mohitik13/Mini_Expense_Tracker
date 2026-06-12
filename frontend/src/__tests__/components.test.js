import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import SummaryPanel from "../components/SummaryPanel";

// ── ExpenseForm ────────────────────────────────────────────────────────────
describe("ExpenseForm", () => {
  const noop = jest.fn();

  test("renders all required fields", () => {
    render(<ExpenseForm onSubmit={noop} onClose={noop} />);
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
  });

  test("shows validation errors for empty submission", async () => {
    render(<ExpenseForm onSubmit={noop} onClose={noop} />);
    // Clear amount (may have default value)
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "" } });
    fireEvent.click(screen.getByText("Add Expense"));
    expect(await screen.findByText(/positive amount/i)).toBeInTheDocument();
    expect(await screen.findByText(/Select a category/i)).toBeInTheDocument();
  });

  test("calls onSubmit with valid data", async () => {
    const mockSubmit = jest.fn().mockResolvedValue({});
    render(<ExpenseForm onSubmit={mockSubmit} onClose={noop} />);

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Food" } });

    fireEvent.click(screen.getByText("Add Expense"));

    // Wait a tick
    await new Promise((r) => setTimeout(r, 50));
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 150, category: "Food" })
    );
  });

  test("shows 'Save Changes' when editing", () => {
    const existing = {
      id: "1",
      amount: 200,
      category: "Food",
      date: "2025-01-10",
      note: "Lunch",
    };
    render(<ExpenseForm initial={existing} onSubmit={noop} onClose={noop} />);
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });
});

// ── ExpenseTable ───────────────────────────────────────────────────────────
describe("ExpenseTable", () => {
  const expenses = [
    { id: "1", amount: 500, category: "Food", date: "2025-01-15", note: "Dinner" },
    { id: "2", amount: 200, category: "Transport", date: "2025-01-14", note: "" },
  ];
  const noop = jest.fn();

  test("renders expense rows", () => {
    render(<ExpenseTable expenses={expenses} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.getByText("Dinner")).toBeInTheDocument();
  });

  test("shows empty state when no expenses", () => {
    render(<ExpenseTable expenses={[]} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText(/No expenses found/i)).toBeInTheDocument();
  });

  test("calls onDelete when delete is clicked", () => {
    const mockDelete = jest.fn();
    // suppress window.confirm
    window.confirm = jest.fn(() => true);
    render(<ExpenseTable expenses={expenses} onEdit={noop} onDelete={mockDelete} />);
    const deleteBtns = screen.getAllByLabelText(/Delete expense/i);
    fireEvent.click(deleteBtns[0]);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  test("calls onEdit when edit is clicked", () => {
    const mockEdit = jest.fn();
    render(<ExpenseTable expenses={expenses} onEdit={mockEdit} onDelete={noop} />);
    const editBtns = screen.getAllByLabelText(/Edit expense/i);
    fireEvent.click(editBtns[0]);
    expect(mockEdit).toHaveBeenCalledWith(expenses[0]);
  });
});

// ── SummaryPanel ───────────────────────────────────────────────────────────
describe("SummaryPanel", () => {
  const summary = {
    totalThisMonth: 1500,
    perCategory: { Food: 800, Transport: 400, Bills: 300, Entertainment: 0, Other: 0 },
    highest: { amount: 800, category: "Food", date: "2025-01-15" },
  };

  test("renders total this month", () => {
    render(<SummaryPanel summary={summary} budgets={{}} />);
    // ₹1,500.00 should appear somewhere
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  test("shows budget exceeded warning", () => {
    const budgets = { Food: 500 }; // Food spent 800, budget 500
    render(<SummaryPanel summary={summary} budgets={budgets} />);
    expect(screen.getByText("Over!")).toBeInTheDocument();
  });
});
