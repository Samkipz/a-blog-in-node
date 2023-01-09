var express = require('express');
var router = express.Router();

const blogs = require("../controllers/blog.controller.js");


// ----------------- Retrieve all Blogs -----------//
router.get("/", blogs.findAll);

//------------------- Create a new Blog ----------//
//get creation page
router.get("/create", blogs.createBlogPage);
//then save to database
router.post("/", blogs.createBlog);


//------------------- Retrieve a single Blog with id--//
router.get("/:id", blogs.findOne);

//Add comments
router.post("/:id/comment", blogs.createComment);


//---------------------- Update a Blog ---------------//
//Get update page
router.get("/update/:id", blogs.updateBlogPage);
router.put("/update/:id", blogs.update);

// Delete a Blog with id
router.delete("/delete/:id", blogs.delete);

module.exports = router;
