const mongoose = require("mongoose")
const Review = require("./review")

const ImageSchema = new mongoose.Schema({
    url: String,
    filename:String
})
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace('/upload','/upload/w_200')
})
const opts = { toJSON: { virtuals: true } };

const campSchema = new mongoose.Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    image: [ImageSchema],
    description: String,
    location: String,
    author: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
    }
   
    ],
    
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

},opts
)

campSchema.virtual("properties.popMarkup").get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0,20)}...</P>
    `

})


campSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in: doc.review
            }
            
        })
    }
})
const Campground = mongoose.model("Campground", campSchema)

module.exports=Campground