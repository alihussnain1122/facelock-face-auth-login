const express= require('express');
const router= express.Router();
const authController = require('../controllers/authController');
const { register, verifyEmail, Login } = authController;

router.post('/register',register);
router.post('/verify-email', verifyEmail);
router.post('/login', Login);

module.exports= router;