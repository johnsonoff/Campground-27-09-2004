if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const methodOverride = require("method-override")
const path = require("path")
const ejsmate = require("ejs-mate")
const Err = require("./Error Handler/ErrorClass")
const campgroundRouter=require("./Routes/campgroundRouter.js")
const reviewRouter = require("./Routes/reviewRoutes.js")
const passportRouter=require("./Routes/userRoutes.js")
const session = require("express-session")
const flash = require("connect-flash")
const User = require("./model/user.js")
const passport = require("passport")
const ls = require("passport-local")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet")
const mongoose = require("mongoose")
const Dburi =process.env.Db || 'mongodb://localhost:27017/yelp-camp'
const MongoStore=require("connect-mongo")

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(Dburi)


}

const store = MongoStore.create({
    mongoUrl: Dburi,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

  
app.engine("ejs",ejsmate)
app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com"]
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    'https://cdn.jsdelivr.net/'
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/daopa8b0n/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionconfig = {
    store,
    name:"session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        
    }
}
app.use(session(sessionconfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())


passport.use(new ls(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req, res, next) => {
    res.locals.currentUser=req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})
  

app.use("/",campgroundRouter)
app.use("/campgrounds/:id/reviews", reviewRouter)
app.use("/",passportRouter)

 

app.get("/fakeuser", async (req, res) => {
    const user = new User({ email: "abc@gmail.com", username: "johnson" })
    const newuser = await User.register(user, "pass")
    res.send(newuser)
})

app.all("*", (req, res, next) => {
    next(new Err("page not found",404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err
    if(!err.message) err.message="this is not a actual message"
    res.status(statusCode).render("error",{err})
})


app.listen(3000, (req, res) => {
    console.log("app is listening to 3000")
})