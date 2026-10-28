import React, { useState } from "react";
import api from "../api/axios"; 
import "../UserProfilePopup.css";

function UserProfilePopup({ user }) {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.put(`/user/update/${user.userId}`, formData);

      // Show success message inside popup
      setMessage("Profile updated successfully!");

      // Close popup after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
        setMessage(""); // clear message so it doesn't show outside
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <div className="profile-display" onClick={() => setShowPopup(true)}>
        <span className="profile-icon">👤</span>
        <span className="profile-name">{user.name}</span>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>User Profile</h3>

            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
            />

            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}

            <div className="popup-buttons">
              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>

            {/* Success/Error message inside popup */}
            {message && <p className="status-message">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfilePopup;
