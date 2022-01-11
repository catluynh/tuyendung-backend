const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const quanTriVienController = require('../controllers/quanTriVienController')

// router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('quản trị viên'));


module.exports = router;