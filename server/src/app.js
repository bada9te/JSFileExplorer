const cors = require('cors');
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();


// init
const app = express();

// handle json req
app.use(express.json());

// cors
app.use(cors({
    origin: process.env.CLIENT_BASE,
    credentials:true,
}));


// handlers
// error handler
app.use(errorHandler);


// TODO: provide app endpoints
app.use('/api/fs', require('./routers/filesystem.router'));


module.exports = app;
