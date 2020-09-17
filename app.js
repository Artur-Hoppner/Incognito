// const { request } = require('express');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const cors = require('cors');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

//Remove????
// app.use(express.static(path.join(__dirname, 'public')));

// Use the passport Middleware
app.use(passport.initialize());
// Bring in the Passport Strategy
require('./config/passport')(passport);

//Connect to mongodb. Import url from confi/keys.js    user and password is stored in .env file
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log(`database connection successfully`);
  })
  .catch((err) => {
    console.log(`unable to connect with database ${err}`);
  });

// app.get('/', (req, res) => {
//   return res.send('<h1>Hello World</h1>');
// });

// Bring in the Users route
const users = require('./routes/api/users');
app.use('/api/users', users);

// Bring in the Events route
const events = require('./routes/api/events');
app.use('/api/events', events);

//specify what port is beeing used.
const PORT = process.env.PORT || 5000;
//listen to server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
