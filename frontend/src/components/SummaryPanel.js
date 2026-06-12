import React from "react";
import "./SummaryPanel.css";
import { formatCurrency, CATEGORIES, CATEGORY_COLORS } from "../utils/helpers";

export default function SummaryPanel({ summary, budgets }) {
  const { totalThisMonth, perCategory, highest } = summary;

  return (
    <section className="summary">
      {/* Big total */}
      <div className="summary__total card">
        <p className="summary__label">Total This Month</p>
        <p className="summary__amount">{formatCurrency(totalThisMonth)}</p>
        {highest && (
          <p className="summary__sub">
            Highest: <strong>{formatCurrency(highest.amount)}</strong>{" "}
            <span className="cat-badge" style={{ "--cat-color": CATEGORY_COLORS[highest.category] }}>
              {highest.category}
            </span>{" "}
            on {highest.date}
          </p>
        )}
      </div>

      {/* Per-category breakdown */}
      <div className="summary__cats">
        {CATEGORIES.map((cat) => {
          const spent = perCategory[cat] || 0;
          const budget = budgets[cat] || 0;
          const over = budget > 0 && spent > budget;
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

          return (
            <div key={cat} className={`summary__cat card ${over ? "summary__cat--over" : ""}`}>
              <div className="summary__cat-header">
                <span className="summary__cat-dot" style={{ background: CATEGORY_COLORS[cat] }} />
                <span className="summary__cat-name">{cat}</span>
                {over && <span className="summary__over-badge">Over!</span>}
              </div>
              <p className="summary__cat-amount">{formatCurrency(spent)}</p>
              {budget > 0 && (
                <>
                  <div className="budget-bar">
                    <div
                      className={`budget-bar__fill ${over ? "budget-bar__fill--over" : ""}`}
                      style={{ width: `${pct}%`, background: over ? "var(--danger)" : CATEGORY_COLORS[cat] }}
                    />
                  </div>
                  <p className="summary__budget-text">
                    Budget: {formatCurrency(budget)}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
