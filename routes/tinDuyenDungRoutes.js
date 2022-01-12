const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const tinTuyenDungController = require('../controllers/tinTuyenDungController')

// router.use(authController.protect);
// router.use(authController.kiemTraLoaiTaiKhoan('nhà tuyển dụng'));

router.route('/timKiemTheoNhieuTieuChi')
    .get(tinTuyenDungController.timKiemTheoNhieuTieuChi)

router.route('/')
    .get(tinTuyenDungController.getAll)
    .post(tinTuyenDungController.postAPI)

router.route('/:id')
    .get(tinTuyenDungController.getAPIById)
    .patch(tinTuyenDungController.updateAPI)
    .delete(tinTuyenDungController.deleteAPI)



module.exports = router;