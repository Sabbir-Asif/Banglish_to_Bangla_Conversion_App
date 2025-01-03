const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/', userController.getAllUsers);
router.get('/search', userController.findUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
