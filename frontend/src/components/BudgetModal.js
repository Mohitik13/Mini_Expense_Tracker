import React, { useState } from "react";
import { CATEGORIES, CATEGORY_COLORS } from "../utils/helpers";

export default function BudgetModal({ budgets, onSave, onClose }) {
  const [form, setForm] = useState(
    CATEGORIES.reduce((acc, cat) => {
      acc[cat] = budgets[cat]?.toString() || "";
      return acc;
    }, {})
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (cat, val) => {
    setForm((f) => ({ ...f, [cat]: val }));
    setError("");
  };

  const handleSave = async () => {
    const payload = {};
    for (const cat of CATEGORIES) {
      const val = parseFloat(form[cat]);
      if (form[cat] !== "" && (isNaN(val) || val < 0)) {
        setError(`Budget for ${cat} must be a positive number or empty.`);
        return;
      }
      if (form[cat] !== "") payload[cat] = val;
    }
    setSaving(true);
    try {
      await onSave(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="budget-title">
        <div className="modal__header">
          <h2 className="modal__title" id="budget-title">Monthly Budgets</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Set a monthly spending limit per category. Leave blank for no limit.
        </p>

        {error && (
          <div className="app__error" style={{ marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CATEGORIES.map((cat) => (
            <div className="form-group" key={cat}>
              <label className="form-label" htmlFor={`budget-${cat}`}
                style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: CATEGORY_COLORS[cat],
                    flexShrink: 0,
                  }}
                />
                {cat}
              </label>
              <input
                id={`budget-${cat}`}
                type="number"
                min="0"
                step="100"
                className="form-input"
                placeholder="No limit"
                value={form[cat]}
                onChange={(e) => handleChange(cat, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Budgets"}
          </button>
        </div>
      </div>
    </div>
  );
}
