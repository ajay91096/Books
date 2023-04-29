require('dotenv').config();

const {
  DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME1, DB_NAME2, DB_DAILECT, DB_PORT,
} = process.env;

module.exports = {
  development: {
    databases: {
      usersDB: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME1,
        host: DB_HOST,
        dialect: DB_DAILECT,
        port: DB_PORT,
      },
      booksDB: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME2,
        host: DB_HOST,
        dialect: DB_DAILECT,
        port: DB_PORT,
      }
    }
  }
};
