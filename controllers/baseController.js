const utilies = require("../utilities/")
const baseController ={}

/***********************************
 * Build the Home view with MVC 
 * unit3, Activities
 ***********************************/
baseController.buildHome = async function(req,res){
    const nav = await utilies.getNav()
    res.render("index", {title: "Home", nav})
}

module.exports = baseController 