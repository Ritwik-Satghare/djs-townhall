const express = require("express");
const router = express.Router();
const Notification = require("../models/notificationModel");
const verifyToken = require("../middleware/authorisation");

// GET all notifications for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      read: false,
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT mark a notification as read
router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
