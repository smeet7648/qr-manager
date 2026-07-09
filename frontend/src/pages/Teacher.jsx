import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import QRGenerator from "../components/QRGenerator";

const socket = io("https://qr-manager-fg6r.onrender.com", {
  transports: ["websocket", "polling"],
});

export default function Teacher() {
  const token = localStorage.getItem("token");

  const [attendance, setAttendance] = useState([]);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://qr-manager-fg6r.onrender.com/api/attendance/all",
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setAttendance(res.data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();

    socket.off("attendanceAdded");

    socket.on("attendanceAdded", () => {
      loadAttendance();
    });

    return () => {
      socket.off("attendanceAdded");
    };
  }, []);

  const generateQR = async () => {
    try {
      const res = await axios.get(
        "https://qr-manager-fg6r.onrender.com/api/attendance/generate",
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setQrCode(res.data.qrCode);

      loadAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>Teacher Dashboard</h1>

        <button onClick={generateQR}>Generate QR</button>

        {qrCode && (
          <div className="qrBox">
            <QRGenerator value={qrCode} />
          </div>
        )}

        <br />

        <button onClick={loadAttendance}>Refresh Attendance</button>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>

                  <th>Email</th>

                  <th>Date</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="4">No Attendance Yet</td>
                  </tr>
                ) : (
                  attendance.map((item) => (
                    <tr key={item._id}>
                      <td>{item.studentId?.name}</td>

                      <td>{item.studentId?.email}</td>

                      <td>{item.date}</td>

                      <td>{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
