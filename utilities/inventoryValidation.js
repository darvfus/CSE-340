const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // classification is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("Please provide a classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists){
              throw new Error("Classification exists. Please use different name")
            }
          }),
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.invRules = () => {
    return [
      // classification is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a make.") // on error this message is sent.
    ]
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.newInvRules = () => {
  return [
    // classification is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make."), // on error this message is sent.    
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model."), // on error this message is sent.
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a image."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide mileage."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a price."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a year."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_color, inv_description, inv_image, inv_miles, inv_price, inv_thumbnail, inv_year} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/edit-inventory", {
        errors,
        title: "Add Inventory",
        nav, inv_id, inv_make, inv_model, inv_color, inv_description, inv_image, inv_miles, inv_price, inv_thumbnail, inv_year
      })
      return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to edit inventory view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_color, inv_description, inv_image, inv_miles, inv_price, inv_thumbnail, inv_year} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav, inv_make, inv_model, inv_color, inv_description, inv_image, inv_miles, inv_price, inv_thumbnail, inv_year
      })
      return
    }
    next()
}

module.exports = validate;