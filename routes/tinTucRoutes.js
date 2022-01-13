const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const tinTucController = require('../controllers/tinTucController')

router.route('/')
    .get(tinTucController.getAll)
    .post(authController.protect, tinTucController.postAPI)

router.route('/:id')
    .get(tinTucController.getAPIById)
    .patch(tinTucController.updateAPI)
    .delete(tinTucController.deleteAPI)

module.exports = router;