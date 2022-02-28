const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const nganhNgheController = require('../controllers/nganhNgheController')

// xu hướng các ngành nghề phổ biến, có sl nhiều nghành nghề nhất
router.route('/xuHuongNganhNghe')
    .get(nganhNgheController.xuHuongNganhNghe)

// tìm kiếm ngành nghê theo lĩnh vực
router.route('/timKiemNgheTheoIDLinhVuc/:idLinhVuc')
    .get(nganhNgheController.timKiemNgheTheoIDLinhVuc)

router.route('/')
    .get(nganhNgheController.getAll)
    .post(nganhNgheController.postAPI)

router.route('/:id')
    .get(nganhNgheController.getAPIById)
    .patch(nganhNgheController.updateAPI)
    .delete(nganhNgheController.deleteAPI)

module.exports = router;