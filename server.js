const express= require('express')
const exphbs = require('express-handlebars')
const logger    = require("morgan");

const PORT = process.env.PORT || 8080;
const app = express();

// Using morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.set('views', './views')
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require('./routes/apiRoutes')(app)

// Start the server
app.listen(PORT, function() {
    console.log(
      "listening on Port:",
      PORT
      
    );
  });