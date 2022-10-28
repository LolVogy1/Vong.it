// Load modules
var express = require('express');
var bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
// Set db
require('./data/reddit-db');

const app = express();


require('./controllers/posts')(app);

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    }));
app.set('views', './views');

// Use express.json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('home');
});

// Render new post form
app.get('/posts/new',(req, res) => {
    res.render('home',{layout:'posts-new'});
});

app.listen(3000);