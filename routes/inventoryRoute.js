// Needed Resources
const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")
const invController = require("../controllers/invController")
const utilities = require("../utilities")
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;