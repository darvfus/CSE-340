const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data); // Aquí se agrega el console.log para ver lo que se retorna
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};
/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailGrid = async function (data) {
  let grid;

  if (data.length > 0) {
    vehicle = await data[0];

    grid = '<ul id="detail-display">';

    grid += "<li>";
    grid += '<div class="img">';
    grid +=
      '<a href="../../inv/detail/' +
      vehicle.inv_id +
      '" title="View ' +
      vehicle.inv_model +
      ": " +
      vehicle.inv_make +
      'details"><img src="' +
      vehicle.inv_image +
      '" alt="Image of ' +
      vehicle.inv_model +
      ": " +
      vehicle.inv_make +
      ' on CSE Motors" /></a>';
    grid += "</div>";
    grid += '<div class="namePrice">';
    grid += "<h2>";
    grid +=
      '<a href="../../inv/detail/' +
      vehicle.inv_id +
      '" title="View ' +
      vehicle.inv_make +
      ": " +
      vehicle.inv_model +
      ' details">' +
      vehicle.inv_make +
      ": " +
      vehicle.inv_model +
      "</a>";
    grid += "</h2>";
    grid += "<h2> Color: " + vehicle.inv_color + "</h2>";
    grid += "<h2> Year: " + vehicle.inv_year + "</h2>";
    grid +=
      "<span>Price: $" +
      new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
      "</span><br>";
    grid +=
      "<span>Mileage: " +
      new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
      "</span>";
    grid += "<p>" + vehicle.inv_description + "</p>";
    grid += "</div>";
    grid += "</li>";

    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};


module.exports = Util;