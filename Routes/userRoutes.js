const express = require("express")
const router = express.Router({mergeParams: true})
const passport = require("passport")
const { storeReturnTo } = require("../middleware")
const users=require("../controllers/userController")

router.route("/register")
   .get(users.renderRegisterForm )
   .post( users.registration)


router.route("/login")
   .get( users.renderLoginForm)
   .post( storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout)

module.exports=router