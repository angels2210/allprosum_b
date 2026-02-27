const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const clientController = require('../controllers/client.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/clients', verifyToken, clientController.create);
router.get('/clients', verifyToken, clientController.getAll);

router.post('/orders', verifyToken, orderController.createOrder);

module.exports = router;