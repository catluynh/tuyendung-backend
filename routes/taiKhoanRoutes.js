const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const taiKhoanController = require('../controllers/taiKhoanController')

router.route('/')
    .get(taiKhoanController.getAll)
    .post(authController.protect, taiKhoanController.postAPI)

router.route('/:id')
    .get(taiKhoanController.getAPIById)
    .patch(taiKhoanController.updateAPI)
    .delete(taiKhoanController.deleteAPI)

module.exports = router;