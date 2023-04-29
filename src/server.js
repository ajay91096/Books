const db = require('./models');
const ip = require('ip');
const host = ip.address();
const app = require('./app');

db.usersDB.sync().then(() => {
  console.log("Users db has been re sync")
})
db.booksDB.sync().then(() => {
  console.log("Books db has been re sync")
})

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, x-access-token, Origin, Content-Type, Accept"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.listen(app.get('port'), (error) => {
  if (error) console.log("Error in server setup");
  console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
    `🌏 Express server started at http://${host}:${app.get('port')}   `);
});

app.on('close', function(){
  db.usersDB.close();
})