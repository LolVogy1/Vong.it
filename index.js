// Load modules
require('dotenv').config();
var express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');
// Set db
require('./data/reddit-db');

const app = express();

// Use express.json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cookieparser
app.use(cookieParser());

app.use(checkAuth);


require('./controllers/posts')(app);
require('./controllers/comments')(app);
require('./controllers/auth')(app);

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    }));
app.set('views', './views');


app.get('/', (req, res) => {
    res.render('home');
});

// Render new post form
app.get('/posts/new',(req, res) => {
    const currentUser = req.user;
    console.log("unga");
    res.render('home',{layout:'posts-new', currentUser});
});

app.listen(3000);

module.exports = app;