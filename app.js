const express = require('express');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
require('dotenv').config();
const authentication = require('./src/middleware/authentication.js');
const DrawRound = require('./src/models/DrawRound');

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

// app.post placehoder

mongoose.connect(process.env.MONGODB_URI)
.then((result) =>
    {
    console.log("Connected to dB")
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
.catch((err) => console.log(err));

