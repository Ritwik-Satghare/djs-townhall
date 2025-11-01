const { convertToDateFormat } = require("../helpers/dateFormat.js");
const Event = require("../models/eventModel.js");
const Form = require("../models/formModel.js");
const mongoose = require("mongoose");
const { eventUploadImage } = require("../helpers/imageUploader.js");
const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const saveForm = async (req, res) => {
  try {
    let { eventData, questions } = req.body;
    const file = req.file; // from multer

    // Parse JSON strings from FormData
    if (typeof eventData === "string") eventData = JSON.parse(eventData);
    if (typeof questions === "string") questions = JSON.parse(questions);

    // Validation
    if (!eventData || !questions || questions.length === 0) {
      return res.status(400).json({
        error: "Event data and questions are required",
      });
    }

    //upload image to cloudinary
    const imageUrl = await eventUploadImage(file.path);

    const session = await mongoose.startSession(); // started a new session
    session.startTransaction(); // started a new transaction

    try {
      //create a form
      const form = await Form.create(
        [
          {
            eventId: new mongoose.Types.ObjectId(), // just a random valid ObjectId
            questions: [],
          },
        ],
        { session }
      ); // [] used becuz we are creating an array of forms and it just works better for sessions in mongodb

      // create an event
      const event = await Event.create(
        [
          {
            name: eventData.name,
            description: eventData.description,
            category: eventData.category,
            venue: eventData.venue,
            dateTime: convertToDateFormat(eventData.date, eventData.time),
            mode: eventData.mode,
            imageUrl: imageUrl,
            formId: form[0]._id, // use form ID we just got
          },
        ],
        { session }
      );

      //update form
      await Form.findByIdAndUpdate(
        form[0]._id,
        { eventId: event[0]._id, questions: questions },
        { session }
      );

      // commit
      await session.commitTransaction();
      session.endSession();

      //success
      res.status(200).json({
        message: "Event and form saved successfully!",
        event: event,
        form: form,
      });
    } catch (error) {
      // catching error for session
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    // in general error catching
    console.error("Error saving:", error);
    res.status(500).json({
      error: "Failed to save event and form",
      details: error.message,
    });
  }
};

const showAllEvents = async (req, res) => {
  try {
    const result = await Event.find().sort({
      dateTime: 1,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log("Could not return events" + error);
    res.status(500).json({ error: `Error fetching events: ${error}` });
  }
};

const showUpcommingEvents = async (req, res) => {
  try {
    const result = await Event.find()
      .sort({
        dateTime: 1,
      })
      .limit(3);
    res.status(200).json(result);
  } catch (error) {
    console.log("Could not return events" + error);
    res.status(500).json({ error: `Error fetching events: ${error}` });
  }
};

const showForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const form = await Form.findOne({ eventId: req.params.id });
    if (!form)
      return res.status(404).json({ error: "Form not found for this event" });

    res.status(200).json({
      name: event.name,
      form,
    });
  } catch (error) {
    console.error("Could not return form:", error);
    res.status(500).json({ error: "Error fetching form" });
  }
};

const submitForm = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { response } = req.body;

    const form = await Form.findOne({ eventId });
    if (!form) {
      return res.status(404).json({ error: "Form id is incorrect" });
    }

    if (!response) {
      console.log("No response attached");
      return res.status(400).json({ error: "No response attached" });
    }

    // Map question IDs to labels
    const labeledResponse = {};
    for (const [id, ans] of Object.entries(response)) {
      const question = form.questions.find((q) => String(q.id) === String(id));
      if (question) {
        labeledResponse[question.label] = ans;
      }
    }

    // Ensure data folder exists
    const dataDir = path.join(__dirname, "..", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const filePath = path.join(dataDir, `${eventId}.csv`);
    const fileExists = fs.existsSync(filePath);

    // Create headers only once — from form.questions
    const headers = form.questions.map((q) => ({
      id: q.label,
      title: q.label,
    }));

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers,
      append: fileExists, // don’t rewrite headers if file exists
    });

    // If file exists, remove header duplication
    if (!fileExists) {
      console.log("Creating new CSV file with headers");
      await csvWriter.writeRecords([labeledResponse]);
    } else {
      console.log("Appending new response to existing CSV");
      const csvAppendWriter = createObjectCsvWriter({
        path: filePath,
        header: headers,
        append: true,
      });
      await csvAppendWriter.writeRecords([labeledResponse]);
    }

    return res
      .status(200)
      .json({ message: "Form responses saved successfully!" });
  } catch (error) {
    console.error("An error occurred:", error);
    return res
      .status(500)
      .json({ error: "Server error while saving responses" });
  }
};


module.exports = {
  saveForm,
  showAllEvents,
  showUpcommingEvents,
  showForm,
  submitForm,
};
