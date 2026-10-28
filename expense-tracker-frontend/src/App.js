import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoginPage from "./components/LoginPage";

function App() {
  const [user, setUser] = React.useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <AppLayout user={user} onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;
