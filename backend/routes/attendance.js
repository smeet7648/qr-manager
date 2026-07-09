const router = require("express").Router();
const { v4: uuid } = require("uuid");

const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

/*
    teacherId : qrCode
*/

let qrSessions = {};

// ===============================
// Teacher Generates QR
// ===============================

router.get("/generate", auth, (req, res) => {
  if (req.user.role !== "teacher") {
    return res.json({
      message: "Only Teacher Can Generate QR",
    });
  }

  const qr = uuid();

  qrSessions[req.user.id] = qr;

  res.json({
    qrCode: qr,
  });
});

// ===============================
// Student Scan
// ===============================

router.post("/scan", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.json({
        message: "Only Student Can Scan",
      });
    }

    const { qrCode } = req.body;

    // Find which teacher owns this QR

    const teacherId = Object.keys(qrSessions).find(
      (id) => qrSessions[id] === qrCode
    );

    if (!teacherId) {
      return res.json({
        message: "Invalid QR",
      });
    }

    const today = new Date().toDateString();

    // Prevent duplicate attendance

    const already = await Attendance.findOne({
      teacherId,
      studentId: req.user.id,
      date: today,
    });

    if (already) {
      return res.json({
        message: "Attendance Already Marked",
      });
    }

    // Save Attendance

    const attendance = await Attendance.create({
      teacherId,
      studentId: req.user.id,
      qrCode,
      date: today,
      status: "Present",
    });

    const student = await Attendance.findById(attendance._id).populate(
      "studentId",
      "name email"
    );

    // Notify Teacher

    const io = req.app.get("io");

    io.emit("attendanceAdded", student);

    res.json({
      message: "Attendance Saved",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ===============================
// Student History
// ===============================

router.get("/history", auth, async (req, res) => {
  try {
    const history = await Attendance.find({
      studentId: req.user.id,
    })
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.log(err);
  }
});

// ===============================
// Teacher Attendance
// ===============================

router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.json({
        message: "Only Teacher",
      });
    }

    const today = new Date().toDateString();

    const data = await Attendance.find({
      teacherId: req.user.id,
      date: today,
    })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;