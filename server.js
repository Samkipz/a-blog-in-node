//----------------- Imports-----------------//
const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override")

const app = express();
// set port, listen for requests
const PORT = process.env.PORT || 3000;

var corsOptions = {
  origin: "http://localhost:3000"
};
//----------------- middleware & static files------//
//----------------- register view engine----------//
app.set('view engine', 'ejs');
app.use(cors(corsOptions));

//---------------------- parse request json and x-www-form-urlencoded----------//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-------------------- Overide method for PUT requests--------------//
app.use(methodOverride('_method'))

//---------------------Static files---------//
app.use(express.static('public'));

const blogRoutes = require('./routes/blog.routes');

const db = require("./models");

//----------------- Database--------------//
//Sync database then listen on port 3000
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    })
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


// for home route, redirect to /blogs 
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

//---------------------- blog routes------------//
app.use('/blogs', blogRoutes);

//------------------------404 page--------------//
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
