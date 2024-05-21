const express = require("express")
const router = express.Router()
const campgrounds=require("../controllers/campgroundController.js")
const wrap = require("../Error Handler/catch")
const { isLoggedIn, iscampAuth, validateschema } = require("../middleware.js")
const multer = require("multer")
const { storage } = require("../cloudinary/index.js")
const upload = multer({ storage})


router.route("/")
    .get(campgrounds.home)

router.route("/campgrounds")
    .get(campgrounds.index )
    .post(isLoggedIn,upload.array("image",10),validateschema, wrap(campgrounds.createCampground))
 
router.get("/campgrounds/new", isLoggedIn, campgrounds.renderNewForm)


router.route("/:id")
  .get(wrap(campgrounds.showCampground))
  .put(isLoggedIn,iscampAuth,upload.array("image") ,validateschema, wrap(campgrounds.updateCampground))
  .delete(isLoggedIn,iscampAuth,wrap(campgrounds.deleteCampground))
  
  router.get("/:id/edit",isLoggedIn,iscampAuth,wrap(campgrounds.editCampgroundForm))



module.exports=router