const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/usersController')





router.post('/cadastro', usersController.create)
router.get('/lista', usersController.findAll)
router.get('/lista/:id', usersController.findByID)
router.put('/cadastro/:id', usersController.update)
router.delete('/cadastro/:id', usersController.delete)




module.exports = router;