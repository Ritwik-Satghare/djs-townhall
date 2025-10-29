const express = require("express");
const router = express.Router();

const {saveForm} = require("../controllers/formController.js");

router.post("/save", saveForm);

module.exports = router;
