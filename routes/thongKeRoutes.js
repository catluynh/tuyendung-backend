const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const thongKeController = require('../controllers/thongKeController')

router.route('/soLuong')
    .get(thongKeController.soLuong)
router.route('/tinTuyenDung')
    .get(thongKeController.tinTuyenDung)
router.route('/donUngTuyen')
    .get(thongKeController.donUngTuyen)
router.route('/tinNoiBat')
    .get(thongKeController.tinNoiBat)

module.exports = router;