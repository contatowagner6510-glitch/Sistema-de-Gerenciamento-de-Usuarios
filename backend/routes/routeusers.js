const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/usersController')





router.post('/', usersController.create)
router.get('/', usersController.findAll)
router.get('/:id', usersController.findByID)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.delete)




module.exports = router;