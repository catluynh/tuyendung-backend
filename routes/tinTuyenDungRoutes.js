const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const tinTuyenDungController = require('../controllers/tinTuyenDungController')

// router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('nhà tuyển dụng'));
router.route('/timKiemTheoNhieuTieuChi')
    .get(tinTuyenDungController.timKiemTheoNhieuTieuChi)

// TIN TUYỂN DỤNG, VIỆC LÀM TỐT NHẤT
router.route('/tinNoiBat')
    .get(tinTuyenDungController.tinNoiBat)

//tìm kiếm việc làm theo ngành nghề
router.route('/timKiemViecLamTheoNganhNghe/:idLinhVuc')
    .get(tinTuyenDungController.timKiemViecLamTheoNganhNghe)

//nhà tuyển dung: tin tuyển dụng đã đăng
router.route('/timKiemTheoNhaTuyenDung')
    .get(authController.protect, tinTuyenDungController.timKiemTheoNhaTuyenDung)


//quản trị viên duyệt tin tuyển dụng
router.route('/duyetTin/:id')
    .patch(tinTuyenDungController.duyetTin)

//quản trị viên khóa tin tuyển dụng
router.route('/khoaTin/:id')
    .patch(tinTuyenDungController.khoaTin)

//nhà tuyển dụng dừng tuyển
router.route('/dungTuyen/:id')
    .patch(tinTuyenDungController.dungTuyen)

router.route('/timKiem/:slug')
    .get(tinTuyenDungController.getAPIBySlug)

router.route('/:id')
    .get(tinTuyenDungController.getAPIById)
    .patch(tinTuyenDungController.updateAPI)
    .delete(tinTuyenDungController.deleteAPI)

router.route('/')
    .get(tinTuyenDungController.getAll)
    .post(tinTuyenDungController.postAPI)

module.exports = router;