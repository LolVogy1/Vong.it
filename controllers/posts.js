const Post = require('../models/post');


module.exports = (app) => {

    // Create a new post
    app.post('/posts/new', async (req, res) => {
      try{
        if(req.user){
          // INSTANTIATE INSTANCE OF POST MODEL
          const post = await new Post(req.body);
      
          // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
          return post.save(() => res.redirect('/'));
        }
        else{
          return res.status(401); // Unauthorised

        }
      } catch(err){
        console.log(err.message);
      }
    });

    // Render posts
    app.get('/',  async (req, res) => {
      try{
        const currentUser = req.user;
        console.log(currentUser);
        const posts = await Post.find({}).lean();
        return res.render('posts-index', {posts, currentUser});
      } catch(err){
        console.log(err.message);
      }
    });

    // Get a single post
    app.get('/r/:subreddit/posts/:id', async (req, res) => {
      try{
        const currentUser = req.user;
        const singlePost = await Post.findById(req.params.id).lean().populate('comments');
        return res.render('posts-show',{singlePost, currentUser});
      } catch(err){
        console.log(err.message);
      }
    });

    // Go to a subreddit
    app.get('/r/:subreddit', async (req, res) => {
      try{
        const currentUser = req.user;
        console.log("aaa");
        const posts = await Post.find({subreddit: req.params.subreddit}).lean();
        console.log(posts);
        return res.render('posts-index',{posts, currentUser});
      } catch(err){
        console.log(err.message);
      }
    });
    
  
  };