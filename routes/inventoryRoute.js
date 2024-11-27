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
router.get("/", utilities.checkAccType, invController.buildManagement);
// Route to build add classification view
router.get("/add/classification", invController.buildClassification);
// Route to build add classification view
router.get("/add/inventory", invController.buildInv);
// Route to deliver footer error
router.get("../partials/footer", baseController.footerErr)
// Route to deliver management inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Route to deliver edit inventory view
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInv))
// Route to deliver delete inventory view
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInv))

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
// Handle inventroy addition
router.post('/update/',
    invValidate.newInvRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))
// Handle inventroy addition
router.post('/delete/',
    utilities.handleErrors(invController.deleteInventory))

module.exports = router;