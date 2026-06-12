import React, { useState } from "react";
import "./Charts.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from "../utils/helpers";

export default function Charts({ summary }) {
  const [chartType, setChartType] = useState("pie");

  const data = CATEGORIES.map((cat) => ({
    name: cat,
    value: summary.perCategory[cat] || 0,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="charts card">
        <p className="charts__empty">No spending data this month yet.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{payload[0].name}</p>
        <p className="chart-tooltip__value">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <div className="charts card">
      <div className="charts__header">
        <h2 className="charts__title">Spending by Category</h2>
        <div className="charts__toggle">
          <button
            className={`charts__toggle-btn ${chartType === "pie" ? "active" : ""}`}
            onClick={() => setChartType("pie")}
          >
            Pie
          </button>
          <button
            className={`charts__toggle-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="charts__body">
        <ResponsiveContainer width="100%" height={260}>
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.08)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
