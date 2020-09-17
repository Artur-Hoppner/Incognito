require('dotenv').config();
let uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@inkognito.oxmlz.mongodb.net/Events?retryWrites=true&w=majority`;

module.exports = {
  mongoURI: uri,
  secret: 'loginsecret',
};
