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

    // Render posts
    app.get('/',  async (req, res) => {
      try{
        const posts = await Post.find({}).lean();
        console.log(posts);
        return res.render('posts-index', {posts});
      } catch(err){
        console.log(err.message);
      }
    });
  
  };