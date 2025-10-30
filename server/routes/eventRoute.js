const express = require("express");
const router = express.Router();
const multer = require("multer");

// multer setup (temporary local storage)
const upload = multer({ dest: "uploads/" });

const {saveForm} = require("../controllers/eventController.js");
const {showAllEvents, showUpcommingEvents} = require("../controllers/eventController.js")

router.post("/save", upload.single('image'),  saveForm);
router.get("/", showAllEvents);
router.get("/upcomming", showUpcommingEvents);

module.exports = router;
