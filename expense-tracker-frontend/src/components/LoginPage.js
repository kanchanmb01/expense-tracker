import React, { useState } from "react";
import api from "../api/axios";
import "../styles.css";
import SignupForm from "./SignupForm";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 // const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  //With JWT token
  const handleLogin = async () => {
    setErrorMessage(""); // reset before new attempt
  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    // Save token in localStorage
    localStorage.setItem("jwtToken", token);

    // Set default header for axios
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    onLogin(user);
  } catch (err) {
    
      /*if (err.response && err.response.data) {
        setErrorMessage(err.response.data); 
       
      } else {
        setErrorMessage("Login failed. Please try again.");
      }*/
      if (
        err.response?.status === 401 &&
        err.response?.data?.message ===
            "Invalid email or password"
      ) {
          setErrorMessage(
              "Invalid email or password. Please login again."
          );

      } else {
          setErrorMessage(
              err.response?.data?.message ||
              "Login failed. Please try again."
          );
      }  
  }
};

  return (
    <div className="login-container">
      <div className="info-panel"> 
        <h2>Expense Tracker</h2>
        <p>
          Manage your income and expenses effortlessly.  
          Track monthly trends, visualize spending, and stay on top of your savings.
        </p>
        <ul>
          <li>💰 Add and categorize your income</li>
          <li>🧾 Record daily expenses</li>
          <li>📊 View insightful charts and reports</li>
        </ul>
      </div>

      <div className="login-panel">
        <h3>Login</h3>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-login" onClick={handleLogin}>Login</button>
        {/*{error && <p className="error">{error}</p>}*/}
         {errorMessage && <p className="error">{errorMessage}</p>}

        <p className="signup-text">
          Don’t have an account?{" "}
          <span className="link" onClick={() => setShowSignup(true)}>Create one</span>
        </p>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-overlay">
          <div className="modal">
            <SignupForm onClose={() => setShowSignup(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
