const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const danhGiaController = require('../controllers/danhGiaController')

router.route('/')
    .get(danhGiaController.getAll)
    .post(authController.protect, authController.kiemTraLoaiTaiKhoan('ung_tuyen_vien'), danhGiaController.postAPI)

router.route('/:id')
    .get(danhGiaController.getAPIById)
    .patch(danhGiaController.updateAPI)
    .delete(danhGiaController.deleteAPI)

module.exports = router;