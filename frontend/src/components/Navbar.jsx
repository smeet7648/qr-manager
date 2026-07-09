// frontend/src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>QR Attendance</h2>

      <div>

        <Link to="/history">History</Link>

        <button onClick={logout}>
          Logout
        </button>

      </div>
    </nav>
  );
}