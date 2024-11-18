const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagament(req, res, next) {
  let nav = await utilities.getNav()
  let type = res.locals.accountData.account_type
  let name = res.locals.accountData.account_firstname
  res.render("account/management", {
    title: "Management",
    Type: type,
    Name: name,
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdateAcc(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Update
* *************************************** */
async function updateAcc(req, res, next) {
  let nav = await utilities.getNav()
  let { account_email, account_firstname, account_lastname, account_id} = req.body
  account_id = parseInt(account_id)
  const updateResult = await accountModel.updateAccount(
    account_email, account_firstname, account_lastname, account_id
  )

  if (updateResult) {
    const details = `Update successful with the following details:\n
    Email: ${updateResult.account_email}\n
    Name: ${updateResult.account_firstname}\n
    Surname: ${updateResult.account_lastname}`
    req.flash("notice", details)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render(`account/update/${account_id}`, {
    title: "Update",
    nav,
    errors: null,
    account_id,
    account_email,
    account_firstname,
    account_lastname
    })
  }
}

/* ****************************************
*  Process Password Change
* *************************************** */
async function changePassword(req, res, next) {
  let nav = await utilities.getNav()
  let { account_password, account_id} = req.body
  account_id = parseInt(account_id)
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password.')
    res.status(500).render(`account/update/${account_id}`, {
      title: "Update",
      nav,
      errors: null,
      account_id
    })
  }

  const regResult = await accountModel.updatePassword(hashedPassword, account_id)
  const {account_firstname, account_lastname, account_type} = await accountModel.getAccountById(account_id)

  let Type = regResult.account_type
  let Name = account_firstname
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve changed the password for ${account_firstname} ${account_lastname}.`
    )
    res.redirect("/account/")
    // res.status(201).render("account/management", {
    //   title: "Management",
    //   nav,
    //   Type,
    //   Name,
    //   errors: null,
    // })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Update",
      nav,
      errors: null,
      account_id
    })
  }
}

/* ****************************************
*  Process Logout
* *************************************** */
async function logout(req, res, next) {
  req.flash("Retricted access. Please log in")
  res.clearCookie("jwt")
  res.locals.accountData = ""
  res.locals.loggedin = 0
  return res.redirect("/")
}

module.exports = { 
  buildLogin, 
  buildRegister,
  buildManagament,
  registerAccount,
  accountLogin,
  buildUpdateAcc,
  updateAcc,
  changePassword,
  logout
}