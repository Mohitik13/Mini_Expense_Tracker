import React, { useState } from "react";
import { CATEGORIES, todayISO } from "../utils/helpers";

export default function ExpenseForm({ initial, onSubmit, onClose }) {
  const isEditing = Boolean(initial);

  const [form, setForm] = useState({
    amount: initial?.amount?.toString() || "",
    category: initial?.category || "",
    date: initial?.date || todayISO(),
    note: initial?.note || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0)
      errs.amount = "Enter a positive amount.";
    if (!form.category)
      errs.category = "Select a category.";
    if (!form.date)
      errs.date = "Date is required.";
    else if (form.date > todayISO())
      errs.date = "Date cannot be in the future.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) });
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal__header">
          <h2 className="modal__title" id="form-title">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {errors._global && (
          <div className="app__error" style={{ marginBottom: 16 }}>{errors._global}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Amount */}
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount (₹) *</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              className="form-input"
              placeholder="e.g. 250.00"
              value={form.amount}
              onChange={handleChange}
              autoFocus
            />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              className="form-input"
              value={form.date}
              max={todayISO()}
              onChange={handleChange}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label" htmlFor="note">Note (optional)</label>
            <input
              id="note"
              name="note"
              type="text"
              className="form-input"
              placeholder="e.g. Dinner at Haldirams"
              maxLength={120}
              value={form.note}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isEditing ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
