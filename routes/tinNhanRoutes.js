const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const tinNhanController = require('../controllers/tinNhanController')

router.route('/')
    .get(tinNhanController.getAll)
    .post(tinNhanController.postAPI)

router.route('/:id')
    .get(tinNhanController.getAPIById)
    .patch(tinNhanController.updateAPI)
    .delete(tinNhanController.deleteAPI)

module.exports = router;