const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler')

router.post('/dangNhap', authController.dangNhap);
router.post('/dangKi', authController.dangKi);
router.get('/xacThucTaiKhoan/:token', authController.xacThucTaiKhoan);
router.post('/quenMatKhau', authController.quenMatKhau);
router.get('/showFormQuenMatKhau/:token', authController.showFormQuenMatKhau);
router.patch('/datLaiMatKhau/:token', authController.datLaiMatKhau);

router.use(authController.protect);
router.use(authController.kiemTraLoaiTaiKhoan(['ung_tuyen_vien', 'nha_tuyen_dung']));
router.patch('/doiMatKhau', authController.doiMatKhau);
//test
router.get('/hello', (req, res)=>{
    console.log(req.taiKhoan);
    res.send('hello');
});

module.exports = router;