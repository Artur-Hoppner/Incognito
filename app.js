// const { request } = require('express');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { iseNewUrlParser: true })
  .then(() => {
    console.log(`database connection successfully ${db}`);
  })
  .catch((err) => {
    console.log(`unable to connect with database ${err}`);
  });

app.get('/', (req, res) => {
  return res.send('<h1>Hello World</h1>');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
