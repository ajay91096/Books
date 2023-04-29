const db = require("../models");
require('dotenv').config();
const Sequelize = require('sequelize');
const Books = db.books;

// POST
const createBook = async (req, res) => {
    try {
        data = req.body;
        const book = await Books.create(data);

        return res.status(200).send(book);
    } catch (e) {
        console.log('createBook:', book, ' - [Error]: ', error);
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    createBook
}