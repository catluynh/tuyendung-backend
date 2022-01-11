const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler')

router.post('/dangNhap', authController.dangNhap);
router.post('/dangKi', authController.dangKi);

router.use(authController.protect);
router.use(authController.kiemTraLoaiTaiKhoan(['ứng tuyển viên', 'nhà tuyển dụng']));
router.patch('/doiMatKhau', authController.doiMatKhau);
//test
router.get('/hello', (req, res)=>{
    console.log(req.taiKhoan);
    res.send('hello');
});

module.exports = router;