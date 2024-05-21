const Campground = require("../model/campground.js")
const Review=require("../model/review.js")



module.exports.createReview = async (req, res) => {
    const camp=await Campground.findById(req.params.id)
    const re = new Review(req.body.review)
    re.author=req.user._id
    camp.review.push(re)
    await re.save()
    await camp.save()
    req.flash("success","successsfully created")
    res.redirect(`/campgrounds/${camp._id}`)
    
}

module.exports.deleteReview=async (req, res) => {
    const{id,reviewid}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash("success","successsfully Review deleted")
    res.redirect(`/campgrounds/${id}`)
}