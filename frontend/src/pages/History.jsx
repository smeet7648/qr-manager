// frontend/src/pages/History.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function History() {

  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    getHistory();

  }, []);

  const getHistory = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/attendance/history",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setHistory(res.data);

  };

  return (

    <div>

      <Navbar />

      <div className="dashboard">

        <h1>Attendance History</h1>

        <table>

          <thead>

            <tr>

              <th>Date</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {history.map((item) => (

              <tr key={item._id}>

                <td>{item.date}</td>

                <td>{item.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}