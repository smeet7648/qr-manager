const router = require("express").Router();
const { v4: uuid } = require("uuid");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

let currentQRCode = null;

// Teacher Generates QR

router.get("/generate", auth, (req, res) => {
  if (req.user.role !== "teacher") {
    return res.json({
      message: "Only Teacher Can Generate QR",
    });
  }

  currentQRCode = uuid();

  res.json({
    qrCode: currentQRCode,
  });
});

// Student Scans QR

router.post("/scan", auth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.json({
      message: "Only Student Can Scan",
    });
  }

  const { qrCode } = req.body;

  if (qrCode !== currentQRCode) {
    return res.json({
      message: "Invalid QR",
    });
  }

  const today = new Date().toDateString();

  const already = await Attendance.findOne({
    studentId: req.user.id,
    date: today,
  });

  if (already) {
    return res.json({
      message: "Attendance Already Marked",
    });
  }

  await Attendance.create({
    studentId: req.user.id,

    date: today,

    qrCode,

    status: "Present",
  });

  const io = req.app.get("io");

  const student = await Attendance.findOne({
    studentId: req.user.id,
    date: today,
  }).populate("studentId", "name email");

  io.emit("attendanceAdded", student);

  res.json({
    message: "Attendance Saved",
  });
});

// History

router.get("/history", auth, async (req, res) => {
  const history = await Attendance.find({
    studentId: req.user.id,
  });

  res.json(history);
});

router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.json({
      message: "Only Teacher",
    });
  }

  const today = new Date().toDateString();

  const data = await Attendance.find({
    date: today,
  }).populate("studentId", "name email");

  res.json(data);
});

module.exports = router;
