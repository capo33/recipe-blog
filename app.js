const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
require("dotenv").config();
let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 5000;
}
const dbURL = process.env.MONGODB_URI;
const routes = require("./server/routes/recipeRoutes");

mongoose
  .connect(dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to MongoDB");
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message);
  });

// Model: Recipe

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("CookingBlogSecure"));
// Define session first
app.use(
  session({
    secret: "CookingBlogSecretSession",
    resave: true,
    saveUninitialized: true,
  })
);
// Then Define flash
app.use(flash());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// Then define your router
app.use("/", routes);

app.set("layout", "layouts/main");
app.set("view engine", "ejs");
