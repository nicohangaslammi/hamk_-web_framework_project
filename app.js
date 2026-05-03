const { engine } = require('express-handlebars');
require('dotenv').config();
const authentication = require('./src/middleware/authentication.js');

// Hilmalle: Poista kommentit näistä, kun express palvelin on luotu (muuttujan nimeksi app)
// // Handlebars setup
// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', './src/views');

// Hilmalle: Tällä funktiolla renderöi home.handlebars-tiedoston
// res.render("home");