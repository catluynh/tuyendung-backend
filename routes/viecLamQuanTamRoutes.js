const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const viecLamQuanTamController = require('../controllers/viecLamQuanTamController')

router.route('/')
    .get(viecLamQuanTamController.getAll)
    .post(authController.protect, viecLamQuanTamController.postAPI)

router.route('/:id')
    .get(viecLamQuanTamController.getAPIById)
    .patch(viecLamQuanTamController.updateAPI)
    .delete(viecLamQuanTamController.deleteAPI)

module.exports = router;