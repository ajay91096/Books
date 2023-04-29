// importing modules
const db = require('../models');
// Assigning db.users to User variable
const Book = db.books;

const validateBook = async (req, res, next) => {
    try {
        const bookCheck = await Book.findOne({
            where: {
              name: req.body.name,
            },
        });

        // if book exist in the database respond with a status of 409
        if (bookCheck) {
            return res.status(403).send("Book is already added.");
        }
        next();
    } catch (e) {
        return res.status(500).send("Internal server error");
    }
}

module.exports = {
    validateBook
}