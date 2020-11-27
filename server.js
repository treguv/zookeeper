const express = require("express");
const { animals } = require("./data/animals");
const fs = require("fs");
const path = require("path");
//Link to the paths
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");
//Set up port for Heroku
const PORT = process.env.PORT || 3001;
//instantiate server
const app = express();
//These need to be set up any time server is looking to accept post data
//parse incomings string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json()); //Use puts a functio non our server that our data has to pass through
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);
//For serving static pages
//Public is replaced with the path in server to where all your sttatic stuff is
//THis is another api path
app.use(express.static("public")); // allows the requests for css and such from the main file

//tell our server to listen on port 3301
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
