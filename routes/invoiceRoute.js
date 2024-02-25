const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/invoiceController');

// Route for sending invoices to customers
router.post('/sendinvoice', invoiceController.sendInvoiceToCustomer);

module.exports = router;