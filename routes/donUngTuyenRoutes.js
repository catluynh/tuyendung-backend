const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const donUngTuyenController = require('../controllers/donUngTuyenController')

// ứng tuyển viên: việc làm đã ứng tuyển
router.route('/timKiemTheoUngTuyenVien')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('ung_tuyen_vien', 'quan_tri_vien'), donUngTuyenController.timKiemTheoUngTuyenVien)

//nhà tuyển dụng: đơn ứng tuyển theo nhà tuyển dụng  
router.route('/timKiemTheoNhaTuyenDung')
    .get(authController.protect, donUngTuyenController.timKiemTheoNhaTuyenDung)

//nhà tuyển dụng: đơn ứng tuyển theo tin
router.route('/timKiemTheoTinTuyenDung/:id')
    .get(authController.protect, donUngTuyenController.timKiemTheoTinTuyenDung)

//nhà tuyển dụng chấp nhận đơn ứng tuyển
router.route('/chapNhanDonUngTuyen/:id')
    .patch(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.chapNhanDonUngTuyen)

//nhà tuyển dụng từ chối đơn ứng tuyển
router.route('/tuChoiDonUngTuyen/:id')
    .patch(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.tuChoiDonUngTuyen)

//nhà tuyển dụng: đơn ứng tuyển tiềm năng
router.route('/donUngTuyenTiemNang')
    .get(authController.protect, donUngTuyenController.donUngTuyenTiemNang)

//nhà tuyển dụng: thêm đơn ứng tuyển tiềm năng
router.route('/themDonUngTuyenTiemNang/:id')
    .patch(donUngTuyenController.themDonUngTuyenTiemNang)

//nhà tuyển dụng: hủy đơn ứng tuyển tiềm năng
router.route('/huyDonUngTuyenTiemNang/:id')
    .patch(donUngTuyenController.huyDonUngTuyenTiemNang)

//nhà tuyển dụng: đếm đơn ứng tuyển theo trạng thái
router.route('/demDonUngTuyenTheoTrangThai')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.demDonUngTuyenTheoTrangThai)

//nhà tuyển dụng: đếm đơn ứng tuyển tiềm năng
router.route('/demDonUngTuyenTiemNang')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.demDonUngTuyenTiemNang)

//nhà tuyển dụng: đếm đơn ứng tuyển theo tin tuyển dụng
router.route('/demDonUngTuyentheoTin/:id')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.demDonUngTuyentheoTin)

//nhà tuyển dụng: gửi mail đến những ứng viên tiềm năng khi đăng tin phù hợp với ứng viên đó
router.route('/guiEmailUngVienTiemNang/:id')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.guiEmailUngVienTiemNang)

router.route('/timKiemTheoNhaTuyenDung1')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('nha_tuyen_dung'), donUngTuyenController.timKiemTheoNhaTuyenDung1)

router.route('/')
    .get(donUngTuyenController.getAll)
    .post(authController.protect, authController.kiemTraLoaiTaiKhoan('ung_tuyen_vien', 'quan_tri_vien'), donUngTuyenController.postAPI)

router.route('/:id')
    .get(donUngTuyenController.getAPIById)
    .patch(donUngTuyenController.updateAPI)
    .delete(donUngTuyenController.deleteAPI)

module.exports = router;