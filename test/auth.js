const chai = require('chai');
const chaiHttp = require('chai-http');
const {describe, it} = require('mocha');
const app = require('../index');

const should = chai.should();

chai.use(chaiHttp);

const agent = chai.request.agent(app);

const User = require('../models/user');

describe('User', function (){
    it('should deny unregistered users', function(done) {
        agent.post('/login', {email: 'bademail@test.com', password: 'incorrect'}).end(function (err, res){
            res.should.have.status(401);
            done();
        });
    });

    it('should be able to sign-up', function(done) {
        User.findOneAndRemove({username: 'testone'}, function(){
            agent
                .post('/sign-up')
                .send({username: 'testone', password: 'password'})
                .end(function(err, res){
                    console.log(res.body);
                    res.should.have.status(200);
                    agent.should.have.cookie('nToken');
                    done();
                });
        });
    });

    it('should be able to login', function (done) {
        agent
          .post('/login')
          .send({ username: 'testone', password: 'password' })
          .end(function (err, res) {
            res.should.have.status(200);
            agent.should.have.cookie('nToken');
            done();
          });
    });

    // logout
    it('should be able to logout', function (done) {
        agent.get('/logout').end(function (err, res) {
        res.should.have.status(200);
        agent.should.not.have.cookie('nToken');
        done();
        });
    });

    after(function(){
        agent.close();
    });
});