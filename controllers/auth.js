const User = require('../models/user')
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    //Sign up form
    app.get('/sign-up', (req, res) => res.render('sign-up'));

    // Logout
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        return res.redirect('/');
    });

    // Login
    app.get('/login', (req, res)=> res.render('login'));

    // Create user account
    app.post('/sign-up', async (req, res) =>{
        try{
            const user = new User(req.body);
            await user.save();
            const token = await jwt.sign({_id: user._id}, process.env.SECRET, {expiresIn: '60 days'});
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true});
            return res.redirect('/');
        } catch(err){
            console.log(err.message);
            return res.status(400).send({err});
        }
    });

    // Send login request
    app.post('/login', async (req, res) => {
        try{
            const {username, password} = req.body;

            // Find username
            const user = await User.findOne({username}, 'username password');
            if(!user){
                // User not found
                return res.status(401).send({message: 'Wrong username or password'});
            }
            // Check password
            user.comparePassword(password,(err, isMatch) =>{
                if(!isMatch){
                    // Password does not match
                    return res.status(401).send({message: 'Wrong username or password'});
                }
                // Create a login token
                const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                    expiresIn: '60 days',
                });
                // Set cookie and redirect to home page
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                return res.redirect('/');

            });
        }catch (err){
            console.log(err.message);
        }
    });
}