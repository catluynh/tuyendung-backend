const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const ungTuyenVienController = require('../controllers/ungTuyenVienController')

router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('ứng tuyển viên', 'quản trị viên'));

//thêm xóa sửa kỹ năng
router.route('/capNhatKyNang')
    .patch(ungTuyenVienController.capNhatKyNang)
router.route('/themKyNang')
    .patch(ungTuyenVienController.themKyNang)
router.route('/xoaKyNang')
    .patch(ungTuyenVienController.xoaKyNang)

//thêm xóa sửa kinh nghiệm làm việc
router.route('/capNhatKinhNghiemLamViec')
    .patch(ungTuyenVienController.capNhatKinhNghiemLamViec)
router.route('/themKinhNghiemLamViec')
    .patch(ungTuyenVienController.themKinhNghiemLamViec)
router.route('/xoaKinhNghiemLamViec')
    .patch(ungTuyenVienController.xoaKinhNghiemLamViec)

//thêm xóa sửa chứng chỉ
router.route('/capNhatChungChi')
    .patch(ungTuyenVienController.capNhatChungChi)
router.route('/themChungChi')
    .patch(ungTuyenVienController.themChungChi)
router.route('/xoaChungChi')
    .patch(ungTuyenVienController.xoaChungChi)

//thêm xóa sửa học vấn
router.route('/capNhatHocVan')
    .patch(ungTuyenVienController.capNhatHocVan)
router.route('/themHocVan')
    .patch(ungTuyenVienController.themHocVan)
router.route('/xoaHocVan')
    .patch(ungTuyenVienController.xoaHocVan)

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