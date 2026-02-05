const express = require('express');
const router = express.Router();

const usersRoutes =require('./routeusers.js')
const tasksRoutes = require('./routetasks.js')

router.use('/tasks' , require ('./routetasks.js'))
router.use('/users' , require ('./routeusers.js'))


module.exports = router;
