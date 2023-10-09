const path = require('path');
const fs = require('fs');
const express = require('express');
const errorHandler = require('./middleware/errorHandler');


// init
const app = express();

// handle json req
app.use(express.json());


// handlers
// error handler
app.use(errorHandler);


// TODO: provide app endpoints
app.use('/fs', require('./routers/filesystem.router'));


module.exports = app;
