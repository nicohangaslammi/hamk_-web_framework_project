const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { engine } = require('express-handlebars');
require('dotenv').config();

// Socket 
const { initializeSocket } = require('./src/services/socket');

// Import routes
const roundsRoutes = require('./src/routes/rounds');
const guessesRoutes = require('./src/routes/guesses');
const devRoutes = require('./src/routes/dev');

const app = express();
const server = http.createServer(app);

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

// Admin panel
app.get('/admin', (req, res) => {
    res.render('admin');
});

// Draw is closed
app.get('/draw-closed', (req,res) => {
    res.render('draw-closed');
});

// Enable JSON parser
app.use(express.json());

// API routes 
app.use('/api/rounds', roundsRoutes);
app.use('/api/guesses', guessesRoutes);

// Dev API routes if in development environment
if (process.env.NODE_ENV === 'development') {
    app.use('/api/dev', devRoutes);
    console.log("enabled development routes");
}

// Connect to MongoDB and start server 
mongoose.connect(process.env.MONGODB_URI)
.then(() =>
    {
    console.log("Connected to dB")
    const PORT = process.env.PORT || 3000;
    initializeSocket(server);
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
.catch((err) => console.log(err));

