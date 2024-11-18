// Needed Resources 
const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventoryValidation')
const utilities = require("../utilities")


/*************************
 * Routes
 *************************/
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build vehicle details by detail view
router.get("/detail/:invId", invController.buildByInvId);
// Route to build management view
router.get("/", invController.buildManagement);
// Route to build add classification view
router.get("/add/classification", invController.buildClassification);
// Route to build add classification view
router.get("/add/inventory", invController.buildInv);
// Route to deliver footer error
router.get("../partials/footer", baseController.footerErr)

// Handle classification addition
router.post('/add/classification',
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification))
// Handle inventroy addition
router.post('/add/inventory',
    invValidate.invRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))


module.exports = router;