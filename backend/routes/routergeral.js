const express = require('express');
const router = express.Router();




router.use('/' , require ('./routeusers.js'))


module.exports = router;
