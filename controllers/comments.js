const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = (app) => {

    // Create a comment
    app.post('/posts/:postID/comments', async (req, res) => {
        try{
            // Make new comment
            const comment = new Comment(req.body);
            // Save it to DB
            await comment.save();
            const post = await Post.findById(req.params.postID);
            // Join the comment to the post
            post.comments.unshift(comment);
            return post.save(() => res.redirect('/'));
        }catch (err){
            console.log(err.message);
        }
    });
};