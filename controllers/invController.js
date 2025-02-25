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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
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

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInv = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
};

/* ****************************************
*  Process Inventory Update
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.buildDeleteInv = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailByInvId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
};

/* ****************************************
*  Process Inventory Deletion
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year
  } = req.body
  
  inv_id = parseInt(inv_id)
  const deletResult = await invModel.deleteInventoryItem(inv_id)
  
  if (deletResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.render("./inventory/delete-confirm-inventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      inv_id: inv_id,
      inv_make: inv_make,
      inv_model: inv_model,
      inv_year: inv_year,
      inv_price: inv_price,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


module.exports = invCont;