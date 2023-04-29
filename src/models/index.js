// importing modules
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const {databases} = require('../config/config')[env]

// Database connection with dialect of postgres specifying the database we are using
// port for my database is 5433
// database name is discover
const { usersDB, booksDB } = databases;

const usersDb = new Sequelize(usersDB);
const booksDb = new Sequelize(booksDB);


// checking if connection is done
usersDb.authenticate().then(() => {
  console.log('Users database connection has been established successfully.');
}).catch((err) => {
  console.log('Unable to connect to the users database:', err);
});

booksDb.authenticate().then(() => {
  console.log('Books database connection has been established successfully.');
}).catch((err) => {
  console.log('Unable to connect to the books database:', err);
});

const db = {};
db.Sequelize = Sequelize;
db.usersDB = usersDb;
db.booksDB = booksDb;

// connecting to model
db.users = require('./userModel') (usersDb, DataTypes);
db.books = require('./bookModel') (booksDb, DataTypes);
// exporting the module
module.exports = db;
