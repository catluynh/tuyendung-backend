const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const nhaTuyenDungController = require('../controllers/nhaTuyenDungController')

//router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('nhà tuyển dụng', 'quản trị viên'));

router.route('/capNhatAvatar')
    .patch(authController.protect, nhaTuyenDungController.capNhatAvatar)

router.route('/timKiem/:slug')
    .get(nhaTuyenDungController.getAPIBySlug)

//Quản trị viên: ds nhà tuyển dụng theo số lượng tin đã đăng
router.route('/nhaTuyenDungTheoSoLuongTin')
    .get(nhaTuyenDungController.nhaTuyenDungTheoSoLuongTin)

router.route('/')
    .get(nhaTuyenDungController.getAll)
    .post(authController.protect, nhaTuyenDungController.postAPI)

router.route('/:id')
    .get(nhaTuyenDungController.getAPIById)
    .patch(nhaTuyenDungController.updateAPI)
    .delete(nhaTuyenDungController.deleteAPI)

module.exports = router;