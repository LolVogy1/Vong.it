const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {

    // Create a comment
    app.post('/posts/:postID/comments', async (req, res) => {
        try{
            if(req.user){
                const userId = req.user._id;
                // Make new comment
                const comment = new Comment(req.body);
                comment.author = userId;
                // Save it to DB
                await comment.save();
                const post = await Post.findById(req.params.postID);

                // Join the comment to the post
                post.comments.unshift(comment);
                post.save();

                // Get user
                const user = await User.findById(userId);
                user.comments.unshift(comment);

                return user.save(() => res.redirect('/'));
            }
            else{
                return res.status(401);
            }
        }catch (err){
            console.log(err.message);
        }
    });
};