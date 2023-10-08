const http = require("http");
const app = require("./app");
require('dotenv').config();

// port
const PORT = process.env.PORT || 8000;

// server
const SERVER = http.createServer(() => {});

// launch 
SERVER.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
