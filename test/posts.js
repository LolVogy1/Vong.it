//test/posts.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const {describe, it, before} = require('mocha');

// Import post model
const Post = require('../models/post')
const app = require('../index')
const User = require('../models/user');

const should = chai.should();
const agent = chai.request.agent(app);

chai.use(chaiHttp);

describe('Posts', function(){
    // Create a test post
    const newPost = {
        title:'test title',
        url:'https://testing.com',
        summary:'this is a test post',
        subreddit:'vongittesting',  
    };
    const user = {username: 'posttest', password: 'testpost',};
    before(function(done){
        agent  
            .post('/sign-up')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(user)
            .then(function(res) {
                done();
            })
            .catch(function(err){
                done(err);
            });
    });
    it('should create a valid post at POST /posts/new', function(done) {
        // Check number of posts
        Post.estimatedDocumentCount()
            .then(function(initialDocCount){
                agent
                    .post('/posts/new')
                    // Fake a form post
                    .set('content-type', 'application/x-www-form-urlencoded')
                    // Make a request to create another post
                    .send(newPost)
                    .then(function(res){
                        Post.estimatedDocumentCount()
                            .then(function(newDocCount){
                                // Check for status 200
                                res.should.have.status(200);
                                // Check that database has one more post
                                newDocCount.should.equal(initialDocCount+1)
                                done();
                            })
                            .catch(function(err){
                                done(err);
                            });
                    })
                    .catch(function(err){
                        done(err);
                    });
            })
            .catch(function(err){
                done(err);
            });
    });

    // Delete the test post
    after(function(done){
        Post.findOneAndDelete(newPost)
        .then(function(){
            agent.close();
            User.findOneAndDelete({username: user.username})
            .then(function(){
                done();
            })
            .catch(function(err){
                done(err);
            });
        })
        .catch(function(err) {
            done(err);
        });
    });
});