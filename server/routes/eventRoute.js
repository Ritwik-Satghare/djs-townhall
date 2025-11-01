const express = require("express");
const router = express.Router();
const multer = require("multer");

// multer setup (temporary local storage)
const upload = multer({ dest: "uploads/" });

const {saveForm} = require("../controllers/eventController.js");
const {showAllEvents, showUpcommingEvents, showForm, submitForm} = require("../controllers/eventController.js")

router.post("/save", upload.single('image'),  saveForm);
router.get("/", showAllEvents);
router.get("/upcomming", showUpcommingEvents);
router.get('/forms/:id', showForm);
router.post('/forms/:id/submit', submitForm);

module.exports = router;
