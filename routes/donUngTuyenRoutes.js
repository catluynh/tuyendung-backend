const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const donUngTuyenController = require('../controllers/donUngTuyenController')

router.route('/')
    .get(donUngTuyenController.getAll)
    .post(donUngTuyenController.postAPI)

router.route('/:id')
    .get(donUngTuyenController.getAPIById)
    .patch(donUngTuyenController.updateAPI)
    .delete(donUngTuyenController.deleteAPI)

module.exports = router;