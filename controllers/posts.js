const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');


module.exports = (app) => {

    // Create a new post
    app.post('/posts/new', async (req, res) => {
      try{
        if(req.user){
          // Get user Id
          const userId = req.user._id;
          // Make a new post and make the user the author
          const post = new Post(req.body);
          post.author = userId;
          post.upVotes = [];
          post.downVotes = [];
          post.voteScore = 0;

          // Save the post
          await post.save();

          // Get user
          const user = await User.findById(userId);
          // Add post to user posts
          user.posts.unshift(post);
          
          // Redirect to new post
          return user.save(() => res.redirect(`/r/${post.subreddit}/posts/${post._id}`));
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
        const posts = await Post.find({}).lean().populate('author');
        return res.render('posts-index', {posts, currentUser});
      } catch(err){
        console.log(err.message);
      }
    });

    // Get a single post
    app.get('/r/:subreddit/posts/:id', async (req, res) => {
      try{
        const currentUser = req.user;
        const singlePost = await Post.findById(req.params.id).populate('comments').lean();
        return res.render('posts-show',{singlePost, currentUser});
      } catch(err){
        console.log(err.message);
      }
    });

    // Go to a subreddit
    app.get('/r/:subreddit', async (req, res) => {
      try{
        const currentUser = req.user;
        const posts = await Post.find({subreddit: req.params.subreddit}).lean();
        return res.render('posts-index',{posts, currentUser});
      } catch(err){
        console.log(err.message);
      }
    });

    // Upvote a post
    app.put('/posts/:id/vote-up', (req, res) => {
      Post.findById(req.params.id).then((err, post) => {
        post.upVotes.push(req.user._id);
        post.voteScore += 1;
        post.save();
    
        return res.status(200);
      });
    });
    
    // Downvote a post
    app.put('/posts/:id/vote-down', (req, res) => {
      Post.findById(req.params.id).then((err, post) => {
        post.downVotes.push(req.user._id);
        post.voteScore -= 1;
        post.save();
    
        return res.status(200);
      });
    });
  
  };