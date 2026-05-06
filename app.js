const express = require('express');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
require('dotenv').config();

// Import admin routes
const adminRoutes = require('./src/routes/admin');

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

// Admin API routes 
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(() =>
    {
    console.log("Connected to dB")
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
.catch((err) => console.log(err));

