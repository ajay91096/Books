const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path');
const router = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

//assigning the variable app to express
const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//setting up your port
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use('/api', router);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message
  });
});


module.exports = app;