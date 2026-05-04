const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();
const authentication = require('./src/middleware/authentication.js');

const app = express();

// Static folder
app.use(express.static('public'));

// // Handlebars setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.get('/', (req,res) => {
    // res.send('Hello World!');
    res.render("home");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));