const db = require("../models");
const Blog = db.blogs;
const Comment = db.comments;
const Op = db.Sequelize.Op;

// ------------ Create and Save new Blogs -------//
//Get creating page:
exports.createBlogPage = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
}
//create and save (post request)
exports.createBlog = (req, res) => {
  const blog = new Blog(req.body);
  // Validate the request
  if (!req.body.title) {
    res.status(400).send({
      message: "You cannot create an empty blog!"
    });
    return;
  }
  return Blog.create({
    title: req.body.title,
    content: req.body.body,
  })
    .then((blog) => {
      console.log(">> New blog created: " + JSON.stringify(blog, null, 4));
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(">> Error while creating new blog: ", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating new blog."
      });
    });
};


//------------------- Create and Save new Comments ----------//
exports.createComment = (req, res) => {
  const blogId = req.params.id;
  return Comment.create({
    name: req.body.name,
    text: req.body.text,
    blogId: blogId,
  })
    .then((comment) => {
      console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
      res.redirect('/blogs/' + blogId);
    })
    .catch((err) => {
      console.log(">> An error while creating comment: ", err);
    });
};

//------------------ Fetch all Blogs including comments ------//
exports.findAll = (req, res) => {
  console.log(`${req.method} ${req.url}`)
  return Blog.findAll({
    include: ["comments"],
  }).then((blogs) => {
    res.render('index', { blogs: blogs, title: 'All blogs' });
  });
};


//-------------- Get a blog and the comments for a given blog -----//
exports.findOne = (req, res) => {
  console.log(`${req.method} ${req.url}`);
  const id = req.params.id;

  Blog.findByPk(id, { include: ["comments"] })
    .then(data => {
      if (data) {
        res.render('details', { blog: data, title: 'Blog Details' });
      } else {
        res.render('404', { title: 'Blog not found' });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Blog with id=" + id
      });
    });
};


//------------------- Update A blog -----------------//
//Get updaate page
exports.updateBlogPage = (req, res) => {
  const id = req.params.id;
  Blog.findByPk(id)
    .then(data => {
      if (data) {
        res.render('update', { blog: data, title: 'Update Blog' });
      } else {
        res.render('404', { title: 'Blog not found' });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Some error occured"
      });
    });
}
//Update it in the database
exports.update = (req, res) => {
  const id = req.params.id;

  console.log(req.body)

  let values = {
    title: req.body.title,
    content: req.body.body,
  }

  Blog.update(
    values, {
    where: { id: id }
  })
    .then((result) => {
      res.redirect('/blogs/' + id);
    }

    )
    .catch(err => {
      res.status(500).send({
        message: "Error updating Blog with id=" + id
      });
    });
};

//------------------- Delete a Blog------------------//
exports.delete = (req, res) => {
  const id = req.params.id;

  Blog.destroy({
    where: { id: id }
  })
    .then((result) => {
      res.redirect('/blogs/' + id);
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Blog with id=" + id
      });
    });
};

// Delete all Blogs from the database.
// exports.deleteAll = (req, res) => {
//   Blog.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} All Blogs were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all blogs."
//       });
//     });
// };