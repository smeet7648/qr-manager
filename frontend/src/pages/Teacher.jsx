import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import QRGenerator from "../components/QRGenerator";

const socket = io("http://localhost:5000");

export default function Teacher() {
  const token = localStorage.getItem("token");

  const [attendance, setAttendance] = useState([]);

  const [qrCode, setQrCode] = useState("");

  const loadAttendance = async () => {
    const res = await axios.get("http://localhost:5000/api/attendance/all", {
      headers: {
        Authorization: token,
      },
    });

    setAttendance(res.data);
  };

  useEffect(() => {
    loadAttendance();

    socket.on("attendanceAdded", (student) => {
      setAttendance((prev) => [...prev, student]);
    });

    return () => {
      socket.off("attendanceAdded");
    };
  }, []);

  const generateQR = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/generate",
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setQrCode(res.data.qrCode);
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>Teacher Dashboard</h1>

        <button onClick={generateQR}>Generate QR</button>

        {qrCode && <QRGenerator value={qrCode} />}

        <table>
          <thead>
            <tr>
              <th>Name</th>

              <th>Date</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((item) => (
              <tr key={item._id}>
                <td>{item.studentId.name}</td>

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
