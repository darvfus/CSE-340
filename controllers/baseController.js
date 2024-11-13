const utilities = require("../utilities/")
const baseController ={}

/***********************************
 * Build the Home view with MVC 
 * unit3, Activities
 ***********************************/
baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
  }

  baseController.footerErr = async function (req, res) {
    res.render("/par/footer", "Yebo")
  }
module.exports = baseController 