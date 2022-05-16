const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const ungTuyenVienController = require('../controllers/ungTuyenVienController')

router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('ứng tuyển viên', 'quản trị viên'));

router.route('/capNhatKyNang')
    .patch(ungTuyenVienController.capNhatKyNang)

router.route('/themKyNang')
    .patch(ungTuyenVienController.themKyNang)

router.route('/xoaKyNang')
    .patch(ungTuyenVienController.xoaKyNang)

router.route('/')
    .get(ungTuyenVienController.getAll)
    .post(ungTuyenVienController.postAPI)

router.route('/capNhatAvatar')
    .patch(ungTuyenVienController.capNhatAvatar)

router.route('/:id')
    .get(ungTuyenVienController.getAPIById)
    .patch(ungTuyenVienController.updateAPI)
    .delete(ungTuyenVienController.deleteAPI)

module.exports = router;