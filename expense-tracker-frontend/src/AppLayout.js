const handleLogout = () => {
  localStorage.removeItem("jwtToken");
  delete api.defaults.headers.common["Authorization"];
  // redirect to login page
  window.location.href = "/login";
};