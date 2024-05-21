const express = require("express")
const router = express.Router({mergeParams: true})
const wrap = require("../Error Handler/catch")
const reviews=require("../controllers/reviewController.js")
const{reviewschema,isLoggedIn,isreviewAuth}=require("../middleware.js")



router.post("/",isLoggedIn,reviewschema,wrap(reviews.createReview))

router.delete("/:reviewid",isLoggedIn,isreviewAuth, wrap(reviews.deleteReview))

module.exports = router
