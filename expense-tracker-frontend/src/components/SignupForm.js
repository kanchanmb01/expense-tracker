import React, { useState } from "react";
import api from "../api/axios";

function SignupForm({ onClose }) {
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");

      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");

      const [valerror,setValErrors]= useState("");

      const validateForm = () => {

          let validationErrors = {};

          if (!name.trim()) {
            validationErrors.name = "Name is required";
          }

          if (!email.trim()) {
            validationErrors.email = "Email is required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
          ) {
            validationErrors.email = "Invalid email format";
          }

          if (!password.trim()) {
            validationErrors.password = "Password is required";
          } else if (password.length < 6) {
            validationErrors.password =
              "Password must be at least 6 characters";
          }

          setValErrors(validationErrors);

          return Object.keys(validationErrors).length === 0;
    };
  const handleSignup = async () => {
     if (!validateForm()) {
         return;
      }
    try {
      await api.post("/auth/signup", { name, email, password });
      setSuccess("Account created successfully! Please login.");
      setError("");
      setTimeout(() => {
        onClose(); // close modal and return to login
      }, 1500);
    } catch (err) { 
     // setError("Signup failed. Try again." + err);
     setError(err.response?.data?.message);
    }
  };

  return (
    <div className="form-group">
      <h3>Create Account</h3>
      <input type="text" placeholder="User Name" value={name} onChange={(e) => setName(e.target.value)} />
      {valerror.name && (
        <p className="error">{valerror.name}</p>
      )}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
     {valerror.email && (
          <p className="error">{valerror.email}</p>
      )}
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {valerror.password && (
          <p className="error">{valerror.password}</p>
      )}
      <button className="btn-login" onClick={handleSignup}>Sign Up</button>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button className="btn-cancel" onClick={onClose}>Cancel</button>
    </div>
  );
}

export default SignupForm;
