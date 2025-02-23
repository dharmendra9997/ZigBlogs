const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
require('dotenv').config();

require('./config/db');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(expressLayouts);


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/admin', adminRoutes);
app.use('/', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
