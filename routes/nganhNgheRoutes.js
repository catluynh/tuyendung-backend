const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const nganhNgheController = require('../controllers/nganhNgheController')

router.route('/')
    .get(nganhNgheController.getAll)
    .post(nganhNgheController.postAPI)

router.route('/:id')
    .get(nganhNgheController.getAPIById)
    .patch(nganhNgheController.updateAPI)
    .delete(nganhNgheController.deleteAPI)

module.exports = router;