const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const donUngTuyenController = require('../controllers/donUngTuyenController')

router.route('/timKiemTheoUngTuyenVien')
    .get(authController.protect, donUngTuyenController.timKiemTheoUngTuyenVien)

router.route('/timKiemTheoTinTuyenDung/:id')
    .get(authController.protect, donUngTuyenController.timKiemTheoTinTuyenDung)

//nhà tuyển dụng chấp nhận ứng tuyển
router.route('/ungTuyen/:id')
    .patch(donUngTuyenController.ungTuyen)

//nhà tuyển dụng từ chối ứng tuyển
router.route('/tuChoiUngTuyen/:id')
    .patch(donUngTuyenController.tuChoiUngTuyen)

router.route('/')
    .get(donUngTuyenController.getAll)
    .post(donUngTuyenController.postAPI)

router.route('/:id')
    .get(donUngTuyenController.getAPIById)
    .patch(donUngTuyenController.updateAPI)
    .delete(donUngTuyenController.deleteAPI)

module.exports = router;