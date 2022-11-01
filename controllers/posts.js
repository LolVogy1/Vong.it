const Post = require('../models/post');


module.exports = (app) => {

    // CREATE
    app.post('/posts/new', (req, res) => {
      console.log("unga");
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
        return res.render('posts-index', {posts});
      } catch(err){
        console.log(err.message);
      }
    });

    // Get a single post
    app.get('/r/:subreddit/posts/:id', async (req, res) => {
      try{
        const singlePost = await Post.findById(req.params.id).lean();
        return res.render('posts-show',{singlePost});
      } catch(err){
        console.log(err.message);
      }
    });

    // Go to a subreddit
    app.get('/r/:subreddit', async (req, res) => {
      try{
        console.log("aaa");
        const posts = await Post.find({subreddit: req.params.subreddit}).lean();
        console.log(posts);
        return res.render('posts-index',{posts});
      } catch(err){
        console.log(err.message);
      }
    });
    
  
  };