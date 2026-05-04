const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();
const authentication = require('./src/middleware/authentication.js');

const app = express();

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));


// Hilmalle: Poista kommentit näistä, kun express palvelin on luotu (muuttujan nimeksi app)
// // Handlebars setup
// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', './src/views');

// Hilmalle: Tällä funktiolla renderöi home.handlebars-tiedoston
// res.render("home");