const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const quanTriVienController = require('../controllers/quanTriVienController')


// quản trị viên khóa tài khoản ứng tuyển viên hoặc nhà tuyển dụng
router.route('/khoaTaiKhoan/:id')
    .patch(authController.protect, quanTriVienController.khoaTaiKhoan)

// quản trị viên mở tài khoản ứng tuyển viên hoặc nhà tuyển dụng
router.route('/moTaiKhoan/:id')
    .patch(authController.protect, quanTriVienController.moTaiKhoan)

router.route('/')
    .get(quanTriVienController.getAll)
    .post(quanTriVienController.postAPI)

router.route('/:id')
    .get(quanTriVienController.getAPIById)
    .patch(quanTriVienController.updateAPI)
    .delete(quanTriVienController.deleteAPI)

module.exports = router;