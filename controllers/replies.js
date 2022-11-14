const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {
    // New reply
    app.get('/r/:subreddit/posts/:postId/comments/:commentId/replies/new', (req, res) => {
        const currentUser = req.user;
        let post;
        Post.findById(req.params.postId).lean()
            .then((p) => {
                post = p;
                return Comment.findById(req.params.commentId).lean();
            })
            .then((comment) =>{
                res.render('replies-new', {post, comment, currentUser});
            })
            .catch((err) => {
                console.log(err.message);
            });
    });

    // Create Reply
    // TODO: allow only logged in users to reply
    app.post('/r/:subreddit/posts/:postId/comments/:commentId/replies', (req, res) => {
        // Make reply into a comment object
        const reply = new Comment(req.body);
        reply.author = req.user._id;
        const oPost = Post.findById(req.params.postId);
        // Lookup parent post
        Post.findById(req.params.postId)
            .then((post) => {
                // Find child comment
                Promise.all([
                    reply.save(),
                    Comment.findById(req.params.commentId),
                ])
                .then(([reply, comment]) => {
                    // Add reply
                    comment.comments.unshift(reply._id);
                    return Promise.all([
                        comment.save(),
                    ]);
                })
                .then(() => res.redirect(`/r/${oPost.subreddit}/posts/${req.params.postId}`))
                .catch(console.error);
            // Save change to parent doc
            return post.save();
        });
    });

};