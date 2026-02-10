const express = require("express");
const router = express.Router();
const billingController = require("./billing.controller");

router.post("/create", billingController.createInvoice);

// Search should come BEFORE :id
router.get("/search/query", billingController.searchInvoice);

router.get("/:id", billingController.getInvoiceById);

module.exports = router;
