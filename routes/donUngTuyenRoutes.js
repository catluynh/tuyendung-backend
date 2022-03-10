const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const donUngTuyenController = require('../controllers/donUngTuyenController')

// ứng tuyển viên: việc làm đã ứng tuyển
router.route('/timKiemTheoUngTuyenVien')
    .get(authController.protect, donUngTuyenController.timKiemTheoUngTuyenVien)

//nhà tuyển dụng: đơn ứng tuyển theo nhà tuyển dụng  
router.route('/timKiemTheoNhaTuyenDung')
    .get(authController.protect, donUngTuyenController.timKiemTheoNhaTuyenDung)

//nhà tuyển dụng: đơn ứng tuyển theo tin
router.route('/timKiemTheoTinTuyenDung/:id')
    .get(authController.protect, donUngTuyenController.timKiemTheoTinTuyenDung)

//nhà tuyển dụng chấp nhận đơn ứng tuyển
router.route('/chapNhanDonUngTuyen/:id')
    .patch(donUngTuyenController.chapNhanDonUngTuyen)

//nhà tuyển dụng từ chối đơn ứng tuyển
router.route('/tuChoiDonUngTuyen/:id')
    .patch(donUngTuyenController.tuChoiDonUngTuyen)

router.route('/')
    .get(donUngTuyenController.getAll)
    .post(donUngTuyenController.postAPI)

router.route('/:id')
    .get(donUngTuyenController.getAPIById)
    .patch(donUngTuyenController.updateAPI)
    .delete(donUngTuyenController.deleteAPI)

module.exports = router;