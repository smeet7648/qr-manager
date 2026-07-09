// frontend/src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    name: "",

    email: "",

    password: "",

    role: "student",

  });

  const register = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "https://qr-attendance.onrender.com/api/auth/register",
        form
      );

      alert(res.data.message);

      navigate("/");

    } catch {

      alert("Registration Failed");

    }

  };

  return (

    <div className="container">

      <form className="card" onSubmit={register}>

        <h1>Register</h1>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >

          <option value="student">
            Student
          </option>

          <option value="teacher">
            Teacher
          </option>

        </select>

        <button>
          Register
        </button>

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </form>

    </div>

  );

}