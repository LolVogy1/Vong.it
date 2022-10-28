const Post = require('../models/post');


module.exports = (app) => {

    // CREATE
    app.post('/posts/new', (req, res) => {
      console.log(req.body);
      // INSTANTIATE INSTANCE OF POST MODEL
      const post = new Post(req.body);
  
      // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
      post.save(() => res.redirect('/'));
    });
  
  };