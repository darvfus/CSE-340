const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  // console.table(req)
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build Vehicle details by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  console.log("invoked");
  const inv_id = req.params.invId;
  const data = await invModel.getDetailByInvId(inv_id);
  const grid = await utilities.buildDetailGrid(data);
  console.log("vontroller: ", data);
  let nav = await utilities.getNav();
  const vehicleName = data[0].inv_make;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildInv = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classification_list = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classification_list,
    errors: null,
  });
};

/* ****************************************
*  Process Classification Addition
* *************************************** */
invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body

  const regResult = await invModel.addClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${classification_name} classification.`
    )
    nav = await utilities.getNav()
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification couldn't be added.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Inventory Addition
* *************************************** */
invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_color, inv_description, inv_image, inv_miles, inv_price, inv_thumbnail, inv_year, classification_id} = req.body
  const regResult = await invModel.addInventory(
    inv_make, inv_model, inv_color, inv_description, inv_image, inv_miles, inv_price, inv_thumbnail, inv_year, classification_id
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${inv_make} ${inv_model} to the inventory.`
    )
    nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the classification couldn't be added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory item",
      nav,
      errors: null,
    })
  }
}
module.exports = invCont;