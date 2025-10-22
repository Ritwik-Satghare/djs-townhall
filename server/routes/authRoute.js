const router = require('express').Router();
const {authTest, registerUser, verifyEmail, loginUser} = require('../controllers/authController.js');

router.get('/test', (authTest));
router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login/:userType', loginUser);

module.exports = router;