# 💸 Expense Tracker

A full-stack expense tracking app built with **Node.js + Express** (backend) and **React** (frontend).

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express, UUID              |
| Frontend | React 18, Recharts, CSS Modules     |
| Storage  | JSON file (`backend/data/`)         |
| Tests    | Jest + Supertest (API), React Testing Library (UI) |

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── __tests__/
│   │   └── api.test.js          # API integration tests
│   ├── data/                    # Auto-created: expenses.json, budgets.json
│   ├── routes/
│   │   ├── expenses.js          # CRUD + filters + summary
│   │   └── budgets.js           # Budget CRUD
│   ├── services/
│   │   └── storage.js           # JSON file read/write
│   ├── jest.config.js
│   ├── package.json
│   └── server.js                # Express entry point (port 5000)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── __tests__/
│   │   │   └── components.test.js
│   │   ├── components/
│   │   │   ├── BudgetModal.js   # Set per-category monthly budgets
│   │   │   ├── Charts.js        # Pie + Bar chart (Recharts)
│   │   │   ├── ExpenseForm.js   # Add / Edit modal form
│   │   │   ├── ExpenseTable.js  # Sortable expense list
│   │   │   ├── FilterBar.js     # Category + date range filters + CSV export
│   │   │   ├── Header.js
│   │   │   ├── Spinner.js
│   │   │   ├── SummaryPanel.js  # Monthly totals, per-category, budget bars
│   │   │   └── Toast.js
│   │   ├── hooks/
│   │   │   └── useExpenses.js   # All data-fetching logic in one hook
│   │   ├── utils/
│   │   │   ├── api.js           # fetch wrappers for all endpoints
│   │   │   └── helpers.js       # formatCurrency, dates, CSV export
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

---

## How to Run Locally (Step by Step)

### Prerequisites
- **Node.js** v18 or newer → https://nodejs.org
- **VS Code** (recommended)

### Step 1 — Clone / Download the project
If you have a zip, extract it. Then open the folder in VS Code.

### Step 2 — Install backend dependencies
Open a terminal in VS Code (`Ctrl + \``) and run:

```bash
cd backend
npm install
```

### Step 3 — Install frontend dependencies
Open a **second terminal** and run:

```bash
cd frontend
npm install
```

### Step 4 — Start the backend
In the **first terminal** (inside `backend/`):

```bash
npm run dev
```

You should see: `Server running on http://localhost:5000`

### Step 5 — Start the frontend
In the **second terminal** (inside `frontend/`):

```bash
npm start
```

The app opens automatically at **http://localhost:3000**

---

## Running Tests

**Backend (API tests):**
```bash
cd backend
npm test
```

**Frontend (component tests):**
```bash
cd frontend
npm test
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses (supports `?category=&startDate=&endDate=`) |
| GET | `/api/expenses/summary` | This month's totals |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/budgets` | Get monthly budgets |
| PUT | `/api/budgets` | Save monthly budgets |

---

## Features

### ✅ Core
- Add, edit, delete expenses
- Amount, category, date, optional note
- JSON file persistence (survives server restart)

### ✅ Filters
- Filter by category (All / Food / Transport / Bills / Entertainment / Other)
- Date presets: This Month, Last Month, All Time
- Custom date range picker

### ✅ Dashboard
- Total spent this month
- Per-category breakdown with color-coded badges
- Highest single expense

### ✅ Charts
- Pie chart + Bar chart toggle (Recharts)
- Color-coded by category

### ✅ Validation
- Amount must be > 0
- Category is required
- Date cannot be in the future
- Errors shown inline

### ✅ Advanced
- CSV export of visible expenses
- Per-category monthly budget with visual progress bar
- "Over budget" warning badge
- Loading spinner, toast notifications
- Responsive design (mobile-friendly)

---

## What Works
Everything in the features checklist above works end-to-end.

## Known Limitations / What I'd Improve With More Time

1. **No authentication** — single-user only, as specified.
2. **JSON file storage** — works for this scope but would switch to SQLite or PostgreSQL for real use (atomic writes, concurrent access, queries).
3. **No pagination** — for large datasets the table would need virtual scrolling or pagination.
4. **Test coverage** — currently covers core paths; would add more edge cases and integration tests with `msw` for frontend.
5. **No data backup** — the JSON file could be accidentally deleted; a simple export-all button would help.
6. **Date handling** — uses local dates (YYYY-MM-DD strings) throughout; a real app would use UTC + timezone-aware storage.
