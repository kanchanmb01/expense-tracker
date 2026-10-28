import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import IncomePage from "./IncomePage";
import ExpensePage from "./ExpensePage";
import ReportsPage from "./ReportsPage";
import UserProfilePopup from "./UserProfilePopup";
import "../styles.css";
import "../UserProfilePopup.css";

function AppLayout({ user, onLogout }) {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="app-title">Expense Tracker</h2>
        <ul className="menu">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/income" className={({ isActive }) => isActive ? "active" : ""}>
              💰 Income Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/expenses" className={({ isActive }) => isActive ? "active" : ""}>
              🧾 Expense Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
              📈 Reports
            </NavLink>
          </li>
          {/*<li>
            <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
              👥 User Management
            </NavLink>
          </li>*/}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
        <div className="topbar-left"></div>
        <div className="topbar-right">
            <UserProfilePopup user={user} />
            <button className="btn-logout" onClick={onLogout}>⎋ Logout</button>
        </div>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/income" element={<IncomePage user={user} />} />
            <Route path="/expenses" element={<ExpensePage user={user} />} />
            <Route path="/reports" element={<ReportsPage user={user} />} />
            {/*<Route path="/users" element={<UserManagementPage user={user} />} />*/}
            {/* Default redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
