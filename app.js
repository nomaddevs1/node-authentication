const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
//DB CONFIG
const env = require("dotenv/config");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
//notes middleware must be place accordincally the routers middleware should be placed last

//Passport config
require("./config/passport")(passport);

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//morgan
app.use(morgan("dev"));

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: "nomaddevs",
    resave: true,
    saveUninitialized: true
  })
);

//passports middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//ROUTES
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

//Database config
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", () => {
  console.log(error);
});
db.once("open", () => console.log("Connected to mongoose"));

//port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server stated on port ${port}`));
