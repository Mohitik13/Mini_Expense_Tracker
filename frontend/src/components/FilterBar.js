import React from "react";
import "./FilterBar.css";
import {
  CATEGORIES,
  getThisMonthRange,
  getLastMonthRange,
  todayISO,
  exportToCSV,
} from "../utils/helpers";

export default function FilterBar({ filters, setFilters, expenses }) {
  const handlePreset = (preset) => {
    if (preset === "thisMonth") {
      setFilters((f) => ({ ...f, datePreset: "thisMonth", ...getThisMonthRange() }));
    } else if (preset === "lastMonth") {
      setFilters((f) => ({ ...f, datePreset: "lastMonth", ...getLastMonthRange() }));
    } else if (preset === "all") {
      setFilters((f) => ({ ...f, datePreset: "all", startDate: "", endDate: "" }));
    } else {
      setFilters((f) => ({ ...f, datePreset: "custom" }));
    }
  };

  return (
    <div className="filterbar card">
      <div className="filterbar__row">
        {/* Category filter */}
        <select
          className="form-select filterbar__select"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Date presets */}
        <div className="filterbar__presets">
          {["thisMonth", "lastMonth", "all", "custom"].map((p) => (
            <button
              key={p}
              className={`filterbar__preset ${filters.datePreset === p ? "active" : ""}`}
              onClick={() => handlePreset(p)}
            >
              {p === "thisMonth" ? "This Month"
                : p === "lastMonth" ? "Last Month"
                : p === "all" ? "All Time"
                : "Custom"}
            </button>
          ))}
        </div>

        {/* Export */}
        <button
          className="btn btn--ghost btn--sm filterbar__export"
          onClick={() => exportToCSV(expenses)}
          disabled={expenses.length === 0}
          title="Download CSV"
        >
          ⬇ CSV
        </button>
      </div>

      {/* Custom date inputs */}
      {filters.datePreset === "custom" && (
        <div className="filterbar__custom">
          <input
            type="date"
            className="form-input"
            value={filters.startDate || ""}
            max={filters.endDate || todayISO()}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            aria-label="Start date"
          />
          <span className="filterbar__to">to</span>
          <input
            type="date"
            className="form-input"
            value={filters.endDate || ""}
            min={filters.startDate}
            max={todayISO()}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            aria-label="End date"
          />
        </div>
      )}

      {/* Count */}
      <p className="filterbar__count">
        {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
