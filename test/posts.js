//test/posts.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const {describe, it} = require('mocha');

// Import post model
const Post = require('../models/post')
const app = require('../index')

const should = chai.should();

chai.use(chaiHttp);

describe('Posts', function(){
    // Create a test post
    const newPost = {
        title:'test title',
        url:'https://testing.com',
        summary:'this is a test post'  
    };
    it('should create a valid post at POST /posts/new', function(done) {
        // Check the current amount of posts
        Post.estimatedDocumentCount()
            .then(function (initialDocCount){
                chai.request.agent(app)
                    .post('/posts/new')
                    // Fake a form post
                    // As we're not really filling out a form
                    .set('content-type','application/x-www-form-urlencoded')
                    // Make a request to create another post
                    .send(newPost)
                    .then(function(res){
                        Post.estimatedDocumentCount()
                            .then(function(newDocCount){
                                // Check for status 200
                                res.should.have.status(200);
                                // Should have 1 new post
                                newDocCount.should.equal(initialDocCount+1)
                                done();
                            })
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
    after(function(){
        Post.findOneAndDelete(newPost, function(err, docs){
            if(err){
                console.log(err);
            }
            else{
                console.log("Deleted Post: ", docs);
            }
        });
    });
});