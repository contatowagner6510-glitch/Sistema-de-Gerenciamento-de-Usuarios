const express = require('express');
const router = express.Router();
const tasksController = require ('../controllers/tasksController')





router.post('/', tasksController.create)
router.get('/', tasksController.findAll)
router.get('/:id', tasksController.findByID)
router.put('/:id', tasksController.update)
router.delete('/:id', tasksController.delete)

// listar tarefas de um usuário específico
router.get('/user/:userId', tasksController.findByUser);



module.exports = router;