const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const donUngTuyenTiemNangController = require('../controllers/donUngTuyenTiemNangController')

router.route('/')
    .get(donUngTuyenTiemNangController.getAll)
    .post(authController.protect, donUngTuyenTiemNangController.postAPI)

router.route('/timTheoNhaTuyenDung')
    .get(authController.protect, donUngTuyenTiemNangController.timTheoNhaTuyenDung)

router.route('/:id')
    .get(donUngTuyenTiemNangController.getAPIById)
    .patch(donUngTuyenTiemNangController.updateAPI)
    .delete(donUngTuyenTiemNangController.deleteAPI)

module.exports = router;