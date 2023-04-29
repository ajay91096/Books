// importing modules
const { Router } = require('express');
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');

const {
  signup, login, getUser, updateUser, deleteUser,
} = userController;

const { createBook } = bookController;

const { saveUser } = require('./middlewares/userAuth');
const { validateBook } = require('./middlewares/validateBook');

const router = Router();

// signup endpoint
// passing the middleware function to the signup
router.post('/users/signup', saveUser, signup);

// login route
router.post('/login', login);

// users?query=
router.get('/users', getUser);
router.put('/users/:email', updateUser);
router.delete('/users/:email', deleteUser);

router.post('/book', validateBook, createBook);
  
module.exports = router;