const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const db = "mongodb+srv://dbAdmin:KdwBpFeh68NmOFWi@bets-t5urt.mongodb.net/test?retryWrites=true&w=majority";
  mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => winston.info(`Connected to ${db}...`));
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
}

/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbAdmin:<password>@bets-t5urt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/