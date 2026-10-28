import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportsPage({ user }) {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = now.getMonth();

  useEffect(() => {
    api.get(`/income/getIncome/user/${user.userId}`).then(res => setIncomeList(res.data));
    api.get(`/expenses/getExpenses/user/${user.userId}`).then(res => setExpenseList(res.data));

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth.toString());
  }, [user]);

  const years = Array.from(
    new Set([...incomeList, ...expenseList].map(i => new Date(i.incomeDate || i.expenseDate).getFullYear()))
  ).sort((a, b) => b - a);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let monthsForYear = [];
  if (selectedYear) {
    monthsForYear = Array.from(
      new Set([...incomeList, ...expenseList]
        .filter(i => new Date(i.incomeDate || i.expenseDate).getFullYear().toString() === selectedYear)
        .map(i => new Date(i.incomeDate || i.expenseDate).getMonth())
      )
    ).sort((a, b) => b - a);

    monthsForYear = [
      ...monthsForYear.filter(m => m === currentMonth),
      ...monthsForYear.filter(m => m !== currentMonth)
    ];
  }

  const filteredIncome = incomeList.filter(i => {
    const d = new Date(i.incomeDate);
    return (!selectedYear || d.getFullYear().toString() === selectedYear) &&
           (!selectedMonth || d.getMonth().toString() === selectedMonth);
  });

  const filteredExpenses = expenseList.filter(e => {
    const d = new Date(e.expenseDate);
    return (!selectedYear || d.getFullYear().toString() === selectedYear) &&
           (!selectedMonth || d.getMonth().toString() === selectedMonth);
  });

  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const highestExpense = filteredExpenses.length
    ? filteredExpenses.reduce((max, e) => (e.amount > max.amount ? e : max))
    : null;
  const lowestExpense = filteredExpenses.length
    ? filteredExpenses.reduce((min, e) => (e.amount < min.amount ? e : min))
    : null;

  //Existing bar chart
  const barData = {
    labels: ["Income", "Expenses", "Savings"],
    datasets: [
      {
        data: [totalIncome, totalExpenses, savings],
        backgroundColor: ["#28a745", "#dc3545", "#0078d4"]
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Income vs Expenses vs Savings" }
    }
  };

  //New comparison chart (Last vs This Month Expenses)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? parseInt(currentYear) - 1 : parseInt(currentYear);

  const lastMonthExpenses = expenseList
    .filter(e => {
      const d = new Date(e.expenseDate);
      return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const currentMonthExpenses = expenseList
    .filter(e => {
      const d = new Date(e.expenseDate);
      return d.getFullYear().toString() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const comparisonData = {
    labels: ["Last Month", "This Month"],
    datasets: [
      {
        label: "Expenses (₹)",
        data: [lastMonthExpenses, currentMonthExpenses],
        backgroundColor: ["#6c757d", "#dc3545"]
      }
    ]
  };

  const comparisonOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Expense Comparison (Last vs This Month)" }
    }
  };

  // Export PDF function with both chart snapshots
  const exportPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    
   
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Monthly Financial Report", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`User: ${user.name}`, 20, 30);
    doc.text(`Year: ${selectedYear || "All"} | Month: ${selectedMonth ? monthNames[selectedMonth] : "All"}`, 20, 38);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Totals Overview", 20, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Total Income: Rs.${String(totalIncome)}`, 25, 60);
    doc.text(`Total Expenses: Rs.${String(totalExpenses)}`, 25, 68);
    doc.text(`Savings: Rs.${String(savings)}`, 25, 76);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, 90);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      `Highest Expense: ${highestExpense ? highestExpense.category.categoryName + " - Rs." + highestExpense.amount : "N/A"}`,
      25,
      100
    );
    doc.text(
      `Lowest Expense: ${lowestExpense ? lowestExpense.category.categoryName + " - Rs." + lowestExpense.amount : "N/A"}`,
      25,
      108
    );
    doc.text(`Savings Rate: ${savingsRate}%`, 25, 116);

    // Chart snapshots
    const chartElements = document.querySelectorAll(".chart-box canvas");
    let yPos = 130;
    for (let chart of chartElements) {
      const canvasImage = await html2canvas(chart);
      const imgData = canvasImage.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 20, yPos, 140, 60);
      yPos += 70; // stack charts vertically in PDF
    }

    // Tables
    //doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Income Records", 20, yPos + 20);

    autoTable(doc, {
      startY: yPos + 20,
      head: [["Date", "Category", "Amount(Rs)", "Notes"]],
      body: filteredIncome.map(i => [
        i.incomeDate,
        i.category.categoryName,
        `${i.amount}`,
        i.notes || ""
      ]),
      theme: "grid",
      styles: { fontSize: 10 }
    });

    // Expense Records
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Expense Records", 20, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Date", "Category", "Amount(Rs)", "Notes"]],
      body: filteredExpenses.map(e => [
        e.expenseDate,
        e.category.categoryName,
        `${e.amount}`,
        e.notes || ""
      ]),
      theme: "grid",
      styles: { fontSize: 10 }
    });

    // Combined Totals
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Combined Totals", 20, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Total Income(Rs)", "Total Expenses(Rs)", "Net Savings(Rs)"]],
      body: [[`${totalIncome}`, `${totalExpenses}`, `${savings}`]],
      theme: "grid",
      styles: { fontSize: 11, halign: "center" }
    });

     // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 285);
    doc.text("Generated by Expense Tracker", 105, 285, { align: "center" });

    doc.save("Financial_Report.pdf");
  };

  return (
    <div className="panel">
      <h2>Reports</h2>

      {/* Filters + Export button inline */}
      <div className="filter-section" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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

        {/* Right-aligned Export button */}
        <button className="btn-save" style={{ marginLeft: "auto" }} onClick={exportPDF}>
          Export PDF
		</button>
	</div>

    {/* Totals */}
      <div className="totals">
        <p style={{ color: "green" }}>Total Income: ₹{totalIncome}</p>
        <p style={{ color: "red" }}>Total Expenses: ₹{totalExpenses}</p>
        <p style={{ color: "blue" }}>Savings: ₹{savings}</p>
      </div>

      {/* Charts side by side */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div className="chart-box" style={{ flex: 1 }}>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-box" style={{ flex: 1 }}>
          <Bar data={comparisonData} options={comparisonOptions} />
        </div>
      </div>
      
      {/*Summary Section */}
      <div className="summary-box">
        <h3>Summary</h3>
        <ul>
          <li>
            Highest Expense:{" "}
            <strong>
              {highestExpense ? `${highestExpense.category.categoryName} - ₹${highestExpense.amount}` : "N/A"}
            </strong>
          </li>
          <li>
            Lowest Expense:{" "}
            <strong>
              {lowestExpense ? `${lowestExpense.category.categoryName} - ₹${lowestExpense.amount}` : "N/A"}
            </strong>
          </li>
          <li>
            Savings Rate: <strong>{savingsRate}%</strong>
          </li>
        </ul>
      </div>

	</div>

	);
}

export default ReportsPage;
