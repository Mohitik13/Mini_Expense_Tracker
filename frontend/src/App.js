import React, { useState } from "react";
import "./App.css";
import { useExpenses } from "./hooks/useExpenses";
import Header from "./components/Header";
import SummaryPanel from "./components/SummaryPanel";
import FilterBar from "./components/FilterBar";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import Charts from "./components/Charts";
import BudgetModal from "./components/BudgetModal";
import Spinner from "./components/Spinner";
import Toast from "./components/Toast";

export default function App() {
  const {
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
  } = useExpenses();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (data) => {
    try {
      await addExpense(data);
      setShowForm(false);
      showToast("Expense added successfully!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleEdit = async (data) => {
    try {
      await editExpense(editingExpense.id, data);
      setEditingExpense(null);
      showToast("Expense updated!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await removeExpense(id);
      showToast("Expense deleted.");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSaveBudgets = async (data) => {
    try {
      await updateBudgets(data);
      setShowBudgetModal(false);
      showToast("Budgets saved!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="app">
      <Header
        onAddClick={() => {
          setEditingExpense(null);
          setShowForm(true);
        }}
        onBudgetClick={() => setShowBudgetModal(true)}
      />

      <main className="app__main">
        {/* Summary */}
        {summary && (
          <SummaryPanel summary={summary} budgets={budgets} />
        )}

        {/* Charts */}
        {summary && <Charts summary={summary} />}

        {/* Filters + Table */}
        <section className="app__expenses">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            expenses={expenses}
          />

          {error && <div className="app__error">{error}</div>}

          {loading ? (
            <Spinner />
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={(e) => {
                setEditingExpense(e);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <ExpenseForm
          initial={editingExpense}
          onSubmit={editingExpense ? handleEdit : handleAdd}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <BudgetModal
          budgets={budgets}
          onSave={handleSaveBudgets}
          onClose={() => setShowBudgetModal(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
