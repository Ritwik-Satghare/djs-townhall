const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    read: { type: Boolean, default: false },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    }, // FIXME: Its not required true now because i have not passed club id with event details

    // for my reference
    eventName: { type: String, required: false },
    clubName: { type: String, default: "NOT INCLUDED" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
