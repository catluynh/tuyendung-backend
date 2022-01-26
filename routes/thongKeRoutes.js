const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const thongKeController = require('../controllers/thongKeController')

router.route('/soLuong')
    .get(thongKeController.soLuong)

module.exports = router;