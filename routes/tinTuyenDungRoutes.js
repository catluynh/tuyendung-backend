const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const tinTuyenDungController = require('../controllers/tinTuyenDungController')

// router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('nhà tuyển dụng'));


router.route('/timKiemTheoNhieuTieuChi')
    .get(tinTuyenDungController.timKiemTheoNhieuTieuChi)

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

router.route('/')
    .get(tinTuyenDungController.getAll)
    .post(tinTuyenDungController.postAPI)

router.route('/:id')
    .get(tinTuyenDungController.getAPIById)
    .patch(tinTuyenDungController.updateAPI)
    .delete(tinTuyenDungController.deleteAPI)



module.exports = router;