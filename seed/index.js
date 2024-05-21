const mongoose = require("mongoose")
// const model = require("../model/model");
const Campground = require("../model/campground");
const cities=require("./cities")
const { descriptors, places } = require("./seedHelpers")
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  await console.log("database connected")
}

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const see=async()=>{
  await Campground.deleteMany({})

  for (let i = 0; i < 300; i++){
    
    const randomm = Math.floor(Math.random() * 1000)
    const randomprice=Math.floor(Math.random() * 20)+20
    const insert = new Campground({
      author:'6631e544dc8d16a5ea488930',
      location: `${cities[randomm].city}, ${cities[randomm].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price: randomprice,
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomm].longitude,cities[randomm].latitude
        ]
    },
      image:[
       
        {
          url: "https://res.cloudinary.com/daopa8b0n/image/upload/v1716007428/yelpcamp/csgbb5c9s5f1lfwvxdcq.jpg",
          filename: 'yelpcamp/rbpgx0eywpg1wpvaxrka',
        
        }
      ]
      ,
      description: " Lorem ipsum dolor sit amet consectetur adipisicing elit.Alias suscipit quod doloremque praesentium voluptates eligendi dignissimos, assumenda rerum quae similique minima cupiditate quo possimus quisquam accusantium quasi in deleniti distinction"
      
    })
   
    await insert.save().then((data) => {
      console.log(data)
    })
  }
}
see()


