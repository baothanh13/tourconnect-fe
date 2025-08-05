const express = require('express');
const router = express.Router();

const login = require('../api/auth/login.Controller');
const register = require('../api/auth/register.Controller');
const logout = require('../api/auth/logout.Controller');
const { getProfile, updateProfile } = require('../api/auth/profile.Controller');
const verifyToken = require('../middleware/verifyToken');  // Import middleware

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
