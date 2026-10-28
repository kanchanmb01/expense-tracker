import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "../styles.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ user }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = now.getMonth().toString();

  // Load data
  useEffect(() => {
    api.get(`/income/getIncome/user/${user.userId}`).then(res => setIncome(res.data));
    api.get(`/expenses/getExpenses/user/${user.userId}`).then(res => setExpenses(res.data));

    // Default selection to current year & month
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  }, [user]);

  // Build year list
  const years = Array.from(
    new Set([...income, ...expenses].map(i => new Date(i.incomeDate || i.expenseDate).getFullYear()))
  ).sort((a, b) => b - a);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Build months for selected year
  let monthsForYear = [];
  if (selectedYear) {
    monthsForYear = Array.from(
      new Set([...income, ...expenses]
        .filter(i => new Date(i.incomeDate || i.expenseDate).getFullYear().toString() === selectedYear)
        .map(i => new Date(i.incomeDate || i.expenseDate).getMonth())
      )
    ).sort((a, b) => a - b);
  }

  // Filter by selected year & month
  const filteredIncome = income.filter(i => {
    const d = new Date(i.incomeDate);
    return (!selectedYear || d.getFullYear().toString() === selectedYear) &&
           (!selectedMonth || d.getMonth().toString() === selectedMonth);
  });

  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.expenseDate);
    return (!selectedYear || d.getFullYear().toString() === selectedYear) &&
           (!selectedMonth || d.getMonth().toString() === selectedMonth);
  });

  // Group and sum by category
  const groupByCategory = (data) => {
    const grouped = {};
    data.forEach(item => {
      const cat = item.category.categoryName;
      grouped[cat] = (grouped[cat] || 0) + item.amount;
    });
    return grouped;
  };

  const incomeGrouped = groupByCategory(filteredIncome);
  const expenseGrouped = groupByCategory(filteredExpenses);

  // Totals
  const totalIncome = Object.values(incomeGrouped).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expenseGrouped).reduce((sum, val) => sum + val, 0);
  const savings = totalIncome - totalExpenses;

  // Pie chart data (unique categories)
  const incomeData = {
    labels: Object.keys(incomeGrouped),
    datasets: [{
      data: Object.values(incomeGrouped),
      backgroundColor: ["#4bc0c0", "#9966ff", "#ff9f40", "#36a2eb", "#ff6384", "#ffce56", "#4bc0c0"],
    }],
  };

  const expenseData = {
    labels: Object.keys(expenseGrouped),
    datasets: [{
      data: Object.values(expenseGrouped),
      backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40", "#c45850"],
    }],
  };

  return (
    <div className="panel">
      <h2>Dashboard</h2>

      {/* Year & Month Filters */}
      <div className="filter-section" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <label>Year:</label>
        <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth(""); }}>
          <option value="">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <label>Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} disabled={!selectedYear}>
          <option value="">All Months</option>
          {monthsForYear.map(m => (
            <option key={m} value={m}>{monthNames[m]}</option>
          ))}
        </select>
      </div>

      {/* Totals */}
      <div className="totals">
        <p style={{ color: "green" }}>Total Income: ₹{totalIncome}</p>
        <p style={{ color: "red" }}>Total Expenses: ₹{totalExpenses}</p>
        <p style={{ color: "blue" }}>Savings: ₹{savings}</p>
      </div>

      {/* Charts side by side */}
      <div className="charts" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div className="chart-box" style={{ flex: 1 }}>
          <h3>Income Breakdown</h3>
          {Object.keys(incomeGrouped).length > 0 ? (
            <Pie data={incomeData} />
          ) : (
            <p style={{ textAlign: "center", color: "gray" }}>NO DATA</p>
          )}
        </div>
        <div className="chart-box" style={{ flex: 1 }}>
          <h3>Expense Breakdown</h3>
          {Object.keys(expenseGrouped).length > 0 ? (
            <Pie data={expenseData} />
          ) : (
            <p style={{ textAlign: "center", color: "gray" }}>NO DATA</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
