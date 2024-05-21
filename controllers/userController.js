const User = require("../model/user")

module.exports.renderRegisterForm=async (req, res) => {
    res.render("passport/register")
}

module.exports.registration=async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registered = await User.register(user, password)
        req.login(registered, err => {
            if (err) { next(err) }
            req.flash("success", "welcome to yelp")
            res.redirect("/campgrounds")
            
        
        })  
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
        
}

module.exports.renderLoginForm=async (req, res) => {
    res.render("passport/login")
}

module.exports.login=async (req, res) => {
    req.flash("success", "welcome back")
    const redirectedurl=res.locals.returnTo || "/campgrounds"
    res.redirect(redirectedurl)
}

module.exports.logout=(req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
   
        req.flash("success", "logged out")
        res.redirect("/campgrounds")
    })
}