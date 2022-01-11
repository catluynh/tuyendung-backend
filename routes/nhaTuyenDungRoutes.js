const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const nhaTuyenDungController = require('../controllers/nhaTuyenDungController')

router.use(authController.protect);
router.use(authController.kiemTraLoaiTaiKhoan('nhà tuyển dụng'));

router.route('/')
    .get(nhaTuyenDungController.getAll)
    .post(nhaTuyenDungController.postAPI)

router.route('/:id')
    .get(nhaTuyenDungController.getAPIById)
    .patch(nhaTuyenDungController.updateAPI)
    .delete(nhaTuyenDungController.deleteAPI)

module.exports = router;