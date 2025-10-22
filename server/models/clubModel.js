const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String },
    isVerified: { type: Boolean, default: false },
    clubId: { type: String },
  },
  { timestamps: true }
);

// Optional: pre-save hook to generate clubId
clubSchema.pre("save", function (next) {
  if (!this.clubId) {
    this.clubId = "CLUB" + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club; // ✅ CommonJS export
