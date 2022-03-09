const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const donUngTuyenController = require('../controllers/donUngTuyenController')

// ứng tuyển viên: việc làm đã ứng tuyển
router.route('/timKiemTheoUngTuyenVien')
    .get(authController.protect, donUngTuyenController.timKiemTheoUngTuyenVien)

//nhà tuyển dụng: hồ sơ ứng tuyển theo nhà tuyển dụng  
router.route('/timKiemTheoNhaTuyenDung')
    .get(authController.protect, donUngTuyenController.timKiemTheoNhaTuyenDung)

//nhà tuyển dụng: hồ sơ ứng tuyển theo tin
router.route('/timKiemTheoTinTuyenDung/:id')
    .get(authController.protect, donUngTuyenController.timKiemTheoTinTuyenDung)

//nhà tuyển dụng chấp nhận hồ sơ ứng viên
router.route('/chapNhaHoSoUngVien/:id')
    .patch(donUngTuyenController.chapNhaHoSoUngVien)

//nhà tuyển dụng từ chối hồ sơ ứng viên
router.route('/tuChoiHoUngVien/:id')
    .patch(donUngTuyenController.tuChoiHoSoUngVien)

router.route('/')
    .get(donUngTuyenController.getAll)
    .post(donUngTuyenController.postAPI)

router.route('/:id')
    .get(donUngTuyenController.getAPIById)
    .patch(donUngTuyenController.updateAPI)
    .delete(donUngTuyenController.deleteAPI)

module.exports = router;