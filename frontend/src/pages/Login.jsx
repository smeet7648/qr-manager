// frontend/src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "https://qr-manager-fg6r.onrender.com//api/auth/login",
        {
          email,
          password,
        }
      );

      if (!res.data.token) {
        alert(res.data.message);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      if (res.data.role === "teacher") {
        navigate("/teacher");
      } else if (res.data.role === "student") {
        navigate("/student");
      }
      else{
        navigate("/signup");
      }

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="container">

      <form className="card" onSubmit={login}>

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>

        <p>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </form>

    </div>
  );
}