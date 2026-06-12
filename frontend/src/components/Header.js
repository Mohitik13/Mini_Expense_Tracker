import React from "react";
import "./Header.css";

export default function Header({ onAddClick, onBudgetClick }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__logo">₹</span>
          <h1 className="header__title">Expense Tracker</h1>
        </div>
        <div className="header__actions">
          <button className="btn btn--ghost btn--sm" onClick={onBudgetClick}>
            🎯 Budgets
          </button>
          <button className="btn btn--primary btn--sm" onClick={onAddClick}>
            + Add Expense
          </button>
        </div>
      </div>
    </header>
  );
}
