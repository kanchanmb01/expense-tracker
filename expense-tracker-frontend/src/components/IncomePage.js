import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles.css";

function IncomePage({ user }) {
  const [incomeList, setIncomeList] = useState([]);
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

  //error
  const [amountError, setAmountError] = useState("");
  const [noteError, setNotesError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    api.get(`/income/getIncome/user/${user.userId}`)
      .then(res => {
        console.log("Income response:", res.data);
        setIncomeList(res.data);
      })
      .catch(err => console.error("Income error:", err));

    api.get(`/categories/getCategoryByType/INCOME`)
      .then(res => setCategories(res.data));

    // Default to “All Years” and “All Months” so everything shows on load
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

  const saveIncome = async () => {
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
        const income = {
          user,
          category: { categoryId },
          amount,
          incomeDate: date,
          notes,
        };

        console.log(
          "Payload:",
          JSON.stringify(income, null, 2)
        );

        await api.post("/income/addIncome", income);
        const res = await api.get(`/income/getIncome/user/${user.userId}`);
        setIncomeList(res.data);
        setAmount(""); setAmountError(""); setCategoryId(""); setDate(""); setNotes(""); setNotesError("");setCategoryError("");
        setShowModal(false);
      }catch(err) {
         console.error(err);
      }
    
  };

  // Build year options dynamically
  const years = Array.from(
    new Set(incomeList.map(i => new Date(i.incomeDate).getFullYear()))
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
        incomeList
          .filter(i => new Date(i.incomeDate).getFullYear().toString() === selectedYear)
          .map(i => new Date(i.incomeDate).getMonth())
      )
    ).sort((a, b) => b - a);
  }

  // Apply filters
  const filteredIncome = incomeList.filter(i => {
    const d = new Date(i.incomeDate);
    const matchCategory = selectedCategory ? i.category.categoryId === parseInt(selectedCategory) : true;
    const matchYear = selectedYear ? d.getFullYear().toString() === selectedYear : true;
    const matchMonth = selectedMonth ? d.getMonth().toString() === selectedMonth : true;
    return matchCategory && matchYear && matchMonth;
  });

  // Calculate Totals
  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);

  // Sort filtered incomes by date descending
  const sortedIncomes = [...filteredIncome].sort(
    (a, b) => new Date(b.incomeDate) - new Date(a.incomeDate)
  );

  return (
    <div className="panel">
      <h2>Income Management</h2>

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
        <button className="btn-add" onClick={() => setShowModal(true)}>➕ Add Income</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr><th>Date</th><th>Category</th><th>Amount</th><th>Notes</th></tr>
        </thead>
        <tbody>
         {sortedIncomes.map(i => {
            const dateObj = new Date(i.incomeDate);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString("en-GB", { month: "short" });
            const year = dateObj.getFullYear();
            const formattedDate = `${day} ${month}, ${year}`;

            return (
              <tr key={i.incomeId}>
                <td>{formattedDate}</td>
                <td>{i.category.categoryName}</td>
                <td>₹{i.amount}</td>
                <td>{i.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Monthly Total Summary */}
      <div className="totals">
        <p style={{ color: "green" }}>Total Income: ₹{totalIncome}</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Income</h3>
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
                <div style={{ color: "red", fontSize: "14px", marginTop: "4px"}}>
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
                <button className="btn-save" onClick={saveIncome}>Save</button>
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomePage;
