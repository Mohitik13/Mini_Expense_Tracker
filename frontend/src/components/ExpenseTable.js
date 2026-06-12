import React from "react";
import "./ExpenseTable.css";
import { formatCurrency, formatDate, CATEGORY_COLORS } from "../utils/helpers";

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="table-empty card">
        <p className="table-empty__icon">💸</p>
        <p className="table-empty__msg">No expenses found.</p>
        <p className="table-empty__sub">Add your first expense or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper card">
      <div className="table-scroll">
        <table className="etable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th className="etable__actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="etable__row">
                <td className="etable__date">{formatDate(expense.date)}</td>
                <td>
                  <span
                    className="etable__cat-badge"
                    style={{ "--cat": CATEGORY_COLORS[expense.category] }}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="etable__amount">{formatCurrency(expense.amount)}</td>
                <td className="etable__note">{expense.note || <span className="etable__no-note">—</span>}</td>
                <td className="etable__actions">
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => onEdit(expense)}
                    aria-label={`Edit expense on ${expense.date}`}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => onDelete(expense.id)}
                    aria-label={`Delete expense on ${expense.date}`}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
