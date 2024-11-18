// Needed Resources 
const express = require("express")
const regValidate = require('../utilities/account-validation')
const router = new express.Router() 
const accController = require("../controllers/accountController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities")
// Route to build account page
router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister);
router.get("../partials/footer", baseController.footerErr)
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accController.registerAccount))
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )
module.exports = router;