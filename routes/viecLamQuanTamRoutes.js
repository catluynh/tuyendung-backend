const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const viecLamQuanTamController = require('../controllers/viecLamQuanTamController')

router.route('/')
    .get(viecLamQuanTamController.getAll)
    .post(authController.protect, viecLamQuanTamController.postAPI)

//ứng tuyển viên: việc làm đã lưu
router.route('/timTheoUngTuyenVien')
    .get(authController.protect, authController.kiemTraLoaiTaiKhoan('ung_tuyen_vien' , 'quan_tri_vien'), viecLamQuanTamController.timTheoUngTuyenVien)

router.route('/:id')
    .get(viecLamQuanTamController.getAPIById)
    .patch(viecLamQuanTamController.updateAPI)
    .delete(viecLamQuanTamController.deleteAPI)

module.exports = router;