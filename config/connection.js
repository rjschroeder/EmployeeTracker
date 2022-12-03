const mysql2 = require("mysql2");
require("dotenv").config();

const db = mysql2.createConnection(
    {
        host: "localhost",
        user: process.env.user,
        password: process.env.key,
        database: process.env.name
    },
    console.log("Connected to Database")
);

module.exports = db;