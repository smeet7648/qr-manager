// frontend/src/pages/Student.jsx
// Replace the whole file

import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Student() {
  const token = localStorage.getItem("token");

  const [message, setMessage] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);

  const scanQR = () => {
    if (scannerStarted) return;

    setScannerStarted(true);

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/attendance/scan",
            {
              qrCode: decodedText,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          setMessage(res.data.message);

          scanner.clear();
        } catch (err) {
          setMessage("Server Error");
        }
      },
      () => {}
    );
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Student Dashboard</h1>

        <button onClick={scanQR}>
          Scan QR Code
        </button>

        <div
          id="reader"
          style={{
            width: "350px",
            marginTop: "20px",
          }}
        ></div>

        <h2
          style={{
            marginTop: "20px",
            color: "green",
          }}
        >
          {message}
        </h2>

      </div>
    </div>
  );
}