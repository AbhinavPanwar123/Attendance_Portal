const express = require("express");
const router = express.Router();
const upload = require("../helper/Multer");
const Attendance = require("../Modal/schema");
const path = require('path'); // Added path import

// Add Student
router.post('/addStudent', async (req, res) => {
  try {
    const { name, rollno, className, password ,image} = req.body;

    const existingStudent = await Attendance.findOne({ rollno });

    if (existingStudent) {
      return res.status(400).send('Student already exists');
    }

    // const image = req.file ? req.file.path : null;

    const newStudent = new Attendance({
      name,
      rollno,
      className,
      password,
      image, 
    });

    await newStudent.save();

    res.status(200).json({
      success: true,
      message: 'Student registered successfully',
      newStudent
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

// Get Profile Data
router.get('/getStudent/:rollno', async (req, res) => {
  const { rollno } = req.params;

  try {
    const student = await Attendance.findOne({ rollno });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const { password, ...profile } = student.toObject();

    // Add image path to profile
    if (profile.image) {
      profile.image = `http://localhost:4000/${profile.image}`;
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Update Profile Route
router.put('/edit', upload.single('image'), async (req, res) => {
  const { name, rollno, className } = req.body;
  const image = req.file;

  try {
    if (!name || !rollno || !className) {
      return res.status(400).json({
        success: false,
        message: "Name, roll number, and class name are required.",
      });
    }

    const studentRecord = await Attendance.findOne({ rollno });
    if (!studentRecord) {
      return res.status(404).json({
        success: false,
        message: "Student record not found.",
      });
    }

    studentRecord.name = name;
    studentRecord.className = className;

    if (image) {
      studentRecord.image = image.path; // Save the path to the uploaded image
    }

    await studentRecord.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      studentRecord,
    });
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
});




// Login
router.post("/login", async (req, res) => {
  const { rollno, password } = req.body;
  try {
    const existingStudent = await Attendance.findOne({ rollno, password });

    if (!existingStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid rollno or password" });
    }

    const { password: _, ...studentData } = existingStudent.toObject();
    return res.status(200).json({
      success: true,
      user: studentData,
    });
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

// Forgot Password
router.post("/verifyRollno", async (req, res) => {
  const { rollno } = req.body;

  try {
    const student = await Attendance.findOne({ rollno });

    if (student) {
      return res.json({ success: true, message: "Roll number verified" });
    } else {
      return res.json({ success: false, message: "Roll number not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/resetPassword", async (req, res) => {
  const { rollno, newPassword } = req.body;

  try {
    const student = await Attendance.findOne({ rollno });

    if (!student) {
      return res.json({ success: false, message: "Roll number not found" });
    }

    student.password = newPassword;
    await student.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Mark In
router.post("/markin", async (req, res) => {
  const { rollno } = req.body;
  try {
    const attendance = await Attendance.findOne({ rollno });
    if (!attendance) {
      return res.status(404).send({
        success: false,
        message: "Student not present",
      });
    }
    const lastAttendance = attendance.attendance[attendance.attendance.length - 1];
    if (lastAttendance && !lastAttendance.markout) {
      return res.status(400).send({
        success: false,
        message: "Cannot mark in again without marking out first",
      });
    }

    const markinTime = Date.now();
    attendance.markin = markinTime;
    attendance.markout = null;

    attendance.attendance.push({
      markin: markinTime,
      markout: null,
    });

    await attendance.save();

    return res.status(200).send({
      success: true,
      attendance,
    });
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

// Mark Out
router.post("/markout", async (req, res) => {
  const { rollno } = req.body;
  try {
    const attendance = await Attendance.findOne({ rollno });
    if (!attendance) {
      return res.status(404).send({
        success: false,
        message: "Student not present",
      });
    }

    if (!attendance.markin) {
      return res.status(400).send({
        success: false,
        message: "Student has not marked in yet.",
      });
    }

    const markinTime = attendance.markin;
    const currentTime = Date.now();
    const timeDifference = currentTime - markinTime;

    if (timeDifference < 6 * 60 * 60 * 1000) {
      return res.status(400).send({
        success: false,
        message: "Minimum 6 hours are required between markin and markout.",
      });
    }

    attendance.markout = currentTime;

    const lastAttendance = attendance.attendance[attendance.attendance.length - 1];
    lastAttendance.markout = currentTime;

    await attendance.save();

    return res.status(200).send({
      success: true,
      attendance,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

// Get Attendance
router.get("/attendance", async (req, res) => {
  const { rollno } = req.query;
  try {
    const attendance = await Attendance.findOne({ rollno });
    if (!attendance) {
      return res.status(404).send({
        success: false,
        message: "Student not present",
      });
    }

    const attendanceRecords = attendance.attendance || [];

    return res.status(200).send({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

// Image Upload
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG and PNG files are allowed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      filePath: req.file.path,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get Image by Roll Number
router.get("/image/:rollno", async (req, res) => {
  const { rollno } = req.params;
  console.log(rollno)

  try {
    const student = await Attendance.findOne({ rollno });

    if (!student || !student.image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    const imagePath = path.join(__dirname, '..', student.image);
    return res.sendFile(imagePath);
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

module.exports = router;
