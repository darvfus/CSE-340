const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

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
module.exports = invCont;