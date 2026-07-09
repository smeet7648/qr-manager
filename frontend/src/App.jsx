// frontend/src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import History from "./pages/History";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/teacher"
        element={<Teacher />}
      />

      <Route
        path="/student"
        element={<Student />}
      />

      <Route
        path="/history"
        element={token ? <History /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;