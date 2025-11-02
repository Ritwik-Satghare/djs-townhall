const express = require('express');
const router = express.Router();

const { createClub, verifyClub, getAllClubs } = require('../controllers/clubController.js');
const verifyToken = require("../middleware/authorisation.js");

router.post('/', createClub);
router.get("/verify", verifyToken, verifyClub);
router.get('/all', getAllClubs);

module.exports = router;