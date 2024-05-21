const Campground = require("./model/campground.js")
const Review=require("./model/review.js")
const { campSchema,reviewSchema} = require("./Schemas.js")
const Err = require("./Error Handler/ErrorClass")




module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.iscampAuth = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author[0].equals(req.user._id)) {
        req.flash("error", "you don't have permission")
        return res.redirect(`/campgrounds/${id}`)
    }
next()
}

module.exports.isreviewAuth = async (req, res, next) => {
    const { id,reviewid } = req.params
    const review= await Review.findById(reviewid)
    if (!review.author[0].equals(req.user._id)) {
        req.flash("error", "you don't have permission")
        return res.redirect(`/campgrounds/${id}`)
    }
next()
}





module.exports.validateschema = (req, res, next) => {
    const { error } = campSchema.validate(req.body)
if (error) {
    const errors = 
        error.details.map(el => el.message ).join(",")
    throw new Err(errors, 505)
    }
else {
    next()
    }
}
module.exports.reviewschema = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
if (error) {
    const errors = 
        error.details.map(el => el.message ).join(",")
    throw new Err(errors, 505)
    }
else {
    next()
    }
}
