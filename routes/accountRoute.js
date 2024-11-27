// Needed Resources 
const express = require("express")
const accValidate = require('../utilities/account-validation')
const router = new express.Router() 
const accController = require("../controllers/accountController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities")

// Routes to build account pages
router.get("/", utilities.checkLogin, utilities.checkAccType, utilities.handleErrors(accController.buildManagament))
router.get("/login", accController.buildLogin);
router.get("/logout", accController.logout);
router.get("/register", accController.buildRegister);
router.get("/update/:account_id", accController.buildUpdateAcc);
router.get("../partials/footer", baseController.footerErr)

router.post('/register',
    accValidate.registrationRules(),
    accValidate.checkRegData, 
    utilities.handleErrors(accController.registerAccount))
// Process the login attempt
router.post(
    "/login",
    accValidate.loginRules(),
    accValidate.checkLogData,
    utilities.handleErrors(accController.accountLogin))
// Process the account update attempt
router.post(
    "/update",
    accValidate.updateRules(),
    accValidate.checkUpdateData,
    utilities.handleErrors(accController.updateAcc))
// Process the account update attempt
router.post(
    "/change",
    accValidate.passwordRules(),
    accValidate.checkPasswordData,
    utilities.handleErrors(accController.changePassword))

module.exports = router;