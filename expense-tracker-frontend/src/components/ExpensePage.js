import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles.css";

function ExpensePage({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Form state
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  //errros
  const [amountError, setAmountError] = useState("");
  const [noteError, setNotesError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    api.get(`/expenses/getExpenses/user/${user.userId}`)
      .then(res => {
        console.log("Expenses response:", res.data);
        setExpenses(res.data);
      })
      .catch(err => console.error("Expenses error:", err));

    api.get(`/categories/getCategoryByType/EXPENSE`)
      .then(res => setCategories(res.data));

    //Default to “All Years” and “All Months” so everything shows on load
    setSelectedYear("");
    setSelectedMonth("");
  }, [user]);

  const today = new Date().toISOString().split("T")[0];

  const handleAmountChange = (e) => {
      const value = e.target.value;

      setAmount(value);

      if (value === "") {
        setAmountError("Amount is required");
      } else if (Number(value) <= 0) {
        setAmountError("Amount must be greater than zero");
      } else {
        setAmountError("");
      }
  };

  const handleNotes = (e) => {
      const value = e.target.value;
      setNotes(value);
      if (value.length >255) {
        setNotesError("Notes cannot exceed 255 characters");
      }else{
        setNotesError("");
      }
  };

  const saveExpense = async () => {
    if (!categoryId) {
      setCategoryError("Please select a category");
      return;
    }

     if (amount === "") {
        setAmountError("Amount is required");
        return;
    }

    if (Number(amount) <= 0) {
        setAmountError("Amount must be greater than zero");
        return;
    }

    setAmountError("");

    try{
        const expense = {
          user,
          category: { categoryId },
          amount,
          expenseDate: date,
          notes,
        };

        console.log(
          "Payload:",
          JSON.stringify(expense, null, 2)
        );
        await api.post("/expenses/addExpense", expense);
        const res = await api.get(`/expenses/getExpenses/user/${user.userId}`);
        setExpenses(res.data);
        setAmount(""); setAmountError(""); setCategoryId(""); setDate(""); setNotes(""); setNotesError("");setCategoryError("");
        setShowModal(false);
      }catch(err) {
         console.error(err);
      }
    
  };

  // Build year options dynamically
  const years = Array.from(
    new Set(expenses.map(e => new Date(e.expenseDate).getFullYear()))
  ).sort((a, b) => b - a);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Months for selected year
  let monthsForYear = [];
  if (selectedYear) {
    monthsForYear = Array.from(
      new Set(
        expenses
          .filter(e => new Date(e.expenseDate).getFullYear().toString() === selectedYear)
          .map(e => new Date(e.expenseDate).getMonth())
      )
    ).sort((a, b) => b - a);
  }

  // Apply filters
  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.expenseDate);
    const matchCategory = selectedCategory ? e.category.categoryId === parseInt(selectedCategory) : true;
    const matchYear = selectedYear ? d.getFullYear().toString() === selectedYear : true;
    const matchMonth = selectedMonth ? d.getMonth().toString() === selectedMonth : true;
    return matchCategory && matchYear && matchMonth;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Sort filtered expenses by date descending
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)
  );

  return (
    <div className="panel">
      <h2>Expense Management</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
          ))}
        </select>

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

      <div className="button-incomExp">
        <button className="btn-add" onClick={() => setShowModal(true)}>➕ Add Expense</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr><th>Date</th><th>Category</th><th>Amount</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {sortedExpenses.map(e => {
            const dateObj = new Date(e.expenseDate);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString("en-GB", { month: "short" });
            const year = dateObj.getFullYear();
            const formattedDate = `${day} ${month}, ${year}`;

            return (
              <tr key={e.expenseId}>
                <td>{formattedDate}</td>
                <td>{e.category.categoryName}</td>
                <td>₹{e.amount}</td>
                <td>{e.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Monthly Totals Summary */}
      <div className="totals">
        <p style={{ color: "red" }}>Total Expenses: ₹{totalExpenses}</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Expense</h3>
            <div className="form-group">
              <label>Date:</label>
              <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />

              <label>Category:</label>
             <select value={categoryId}  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setCategoryError("");
              }}>
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
              </select>
              {categoryError &&
                  <span className="error">
                      {categoryError}
                  </span>
              }

              <label>Amount:</label>
              <input type="number" value={amount} onChange={handleAmountChange} />
              
              {amountError && (
                  <div
                      style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "1px"
                      }}
                  >
                      {amountError}
                  </div>
              )}

              <label>Notes:</label>
              <input type="text" value={notes} onChange={handleNotes} />
               {noteError && (
                <div style={{ color: "red", fontSize: "14px", marginTop: "4px"}}>
                    {noteError}
                </div>
              )}

              <div className="button-group">
                <button className="btn-save" onClick={saveExpense}>Save</button>
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensePage;
