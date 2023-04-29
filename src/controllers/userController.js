const {sign} = require("jsonwebtoken");
const db = require("../models");
require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {
  ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY,
} = process.env;

const User = db.users;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const isSame = password == user.password;
      if (isSame) {
        const accessToken = sign(
          { userName: user.userName, email: user.email, role: user.role },
          ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRY },
        );
        const refreshToken = sign(
          { userName: user.userName, email: user.email, role: user.role },
          REFRESH_TOKEN_SECRET,
          { expiresIn: REFRESH_TOKEN_EXPIRY },
        );
        res.status(200).send({
          token: accessToken,
          refreshToken,
        });
      } else {
        return res.status(401).send('Authentication failed');
      }
    } else {
      return res.status(401).send('Authentication failed');
    }
  } catch (error) {
    console.log('login - [Error]: ', error);
    return res.status(500).send('Internal server error');
  }
};

// signing a user up
// hashing users password before its saved to the database
const signup = async (req, res) => {
  try {
    const data = req.body;
    // saving the user
    const user = await User.create(data);

    if (user) {
      const token = sign(
        {
          name: user.username,
          password: user.password,
          email: user.email,
          role: user.role,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY },
      );
      res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log('user', JSON.stringify(user, null, 2));
      console.log(token);

      return res.status(200).send(user);
    }
    return res.status(400).send('Invalid request body');
  } catch (error) {
    console.log('signup - [Error]: ', error);
    return res.status(500).send('Internal server error');
  }
};

const getUser = async (req, res) => {
  const queryType = req.query.query;
  console.log('getUser - query: ', req.query.query);
  if (!queryType) {
    console.log("Requested item wasn't found!, ?query=xxxx is required!");
    return res.status(409).send('?query=xxxx is required! NB: xxxx is all / email');
  }
  try {
    if (queryType == 'all') {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        where: {
          role: { [Op.not]: 'admin' },
        },
      });
      if (users) {
        return res.status(200).json(users);
      }
      return res.status(400).send('Invalid request body');
    }
    const user = await User.findOne({
      where: {
        email: queryType,
      },
      attributes: { exclude: ['password'] },
    });
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(400).send('Invalid request body');
  } catch (error) {
    console.log('getUser - queryType:', queryType, ' - [Error]: ', error);
    return res.status(500).send('Internal server error');
  }
};

const updateUser = async (req, res) => {
  const updateItem = req.params.email;
  console.log('updateUser - updateItem: ', updateItem);
  const {
    userName, email, password, role,
  } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: updateItem,
      },
    });
    if (!user) {
      return res.status(409).send(`Requested ${updateItem} wasn't found!`);
    }
    const checkSameUser = await User.findOne({
      where: {
        email: user.email,
      },
    });
    if (checkSameUser && updateItem != user.email) {
      return res.status(403).send(`Requested ${email} is duplicate, please change and retry it.`);
    }
    await User.update(
      {
        userName,
        email,
        password,
        role,
      },
      {
        where: { email: updateItem },
      },
    );
    const findUser = await User.findOne({
      where: {
        email,
      },
      attributes: { exclude: ['password'] },
    });
    return res.status(200).send(findUser);
  } catch (error) {
    console.log('updateUser - updateItem:', updateItem, ' - [Error]: ', error);
    return res.status(500).send('Internal server error');
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(409).send(`Requested ${email} wasn't found!`);
    }
    await user.destroy();
    return res.status(200).send('OK');
  } catch (error) {
    console.log('deleteUser - email:', email, ' - [Error]: ', error);
    return res.status(500).send('Internal server error');
  }
};

module.exports = {
  login,
  signup,
  getUser,
  updateUser,
  deleteUser,
};
