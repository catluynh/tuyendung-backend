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

module.exports = router;