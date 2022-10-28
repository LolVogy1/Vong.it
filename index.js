// Load modules
var express = require('express');
const handlebars = require('express-handlebars');
// Set db
require('./data/reddit-db');

const app = express();

// Use express.json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./controllers/posts')(app);

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
    res.render('home',{layout:'posts-new'});
});

app.listen(3000);