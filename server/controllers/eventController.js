const { convertToDateFormat } = require("../helpers/dateFormat.js");
const Event = require("../models/eventModel.js");
const Form = require("../models/formModel.js");
const mongoose = require("mongoose");
const { eventUploadImage } = require("../helpers/imageUploader.js");

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
    const result = await Event.find().populate("formId").sort({
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
      .populate("formId")
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



module.exports = { saveForm, showAllEvents, showUpcommingEvents };
