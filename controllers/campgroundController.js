const { query } = require("express");
const Campground = require("../model/campground.js")
const cloudinary = require('cloudinary').v2;
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapbox = process.env.Map_token
const geocode=mbxGeocoding({accessToken:mapbox})

module.exports.home = async (req, res) => {
    res.render("home")
}

module.exports.index = async (req, res) => {
    const camps = await Campground.find({})
    res.render("campgrounds/index",{camps})
}

module.exports.renderNewForm=(req, res) => {
  
    res.render("campgrounds/new.ejs")
}

module.exports.createCampground=async (req, res, next) => {
    const geodata = await geocode.forwardGeocode({
        query:req.body.campground.location,limit:1
    }).send()
    const camps = await new Campground(req.body.campground)
    camps.geometry= geodata.body.features[0].geometry
    const imagee=req.files.map((f)=>({url:f.path,filename:f.filename}))
    camps.author = req.user._id
    camps.image.push(...imagee)
    await camps.save()
    req.flash("success","successsfully created")
    res.redirect(`/campgrounds/${camps._id}`)
    

}

module.exports.showCampground=async (req, res) => {
    const camps = await Campground.findById(req.params.id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camps) {
        req.flash("error", "cannot find the campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show",{camps})
    
}
module.exports.editCampgroundForm=async (req, res) => {
    const camps = await Campground.findById(req.params.id)
    if (!camps) {
        req.flash("error", "cannot find the campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit",{camps})
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const camps = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imagee = req.files.map((img) => ({ url: img.path, filename: img.filename }))
    camps.image.push(...imagee)
    await camps.save()
    
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camps.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
      
    }
    req.flash("success","successsfully updated")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async (req,res) => {
    const { id } = req.params
    const camps = await Campground.findByIdAndDelete(id)
    await Campground.deleteMany({ title: '' })
    req.flash("success","successsfully deleted")
    res.redirect("/campgrounds")

}