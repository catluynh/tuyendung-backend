const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const linhVucController = require('../controllers/linhVucController')

router.route('/')
    .get(linhVucController.getAll)
    .post(linhVucController.postAPI)

router.route('/:id')
    .get(linhVucController.getAPIById)
    .patch(linhVucController.updateAPI)
    .delete(linhVucController.deleteAPI)

module.exports = router;