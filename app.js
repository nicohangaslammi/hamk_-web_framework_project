const express = require('express');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
require('dotenv').config();

// Import routes
const adminRoutes = require('./src/routes/admin');
const roundsRoutes = require('./src/routes/rounds');
const guessesRoutes = require('./src/routes/guesses');
const devRoutes = require('./src/routes/dev');

// Middleware
const authentication = require('./src/middleware/authentication');

const app = express();

// Static folder
app.use(express.static('public'));

// // Handlebars setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Home
app.get('/', (req,res) => {
    res.render("home");
});

// Draw is closed
app.get('/draw-closed', (req,res) => {
    res.render('draw-closed');
});

// Enable JSON parser
app.use(express.json());

// API routes 
app.use('/api/admin', authentication, adminRoutes);
app.use('/api/rounds', roundsRoutes);
app.use('/api/guesses', guessesRoutes);

// Dev API routes if in development environment
if (process.env.NODE_ENV === 'development') {
    app.use('/api/dev', authentication, devRoutes);
    console.log("enabled development routes");
}

mongoose.connect(process.env.MONGODB_URI)
.then(() =>
    {
    console.log("Connected to dB")
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
.catch((err) => console.log(err));

