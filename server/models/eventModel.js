const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: "technical" },
    venue: { type: String, required: true },
    dateTime: { type: Date, required: true }, 
    mode: { type: String, required: true },
    imageUrl: {type: String},
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
