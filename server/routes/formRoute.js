const express = require("express");
const router = express.Router();
const multer = require("multer");

// multer setup (temporary local storage)
const upload = multer({ dest: "uploads/" });

const {saveForm} = require("../controllers/formController.js");

router.post("/save", upload.single('image'),  saveForm);

module.exports = router;
