const express = require('express');
const router = express.Router();

const { createClub } = require('../controllers/clubController.js');

router.post('/', createClub);

module.exports = router;