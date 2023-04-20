const express = require('express');
const path = require('path');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

app.get('/profile-picture', function (req, res) {
  const img = fs.readFileSync('/home/app/images/profile-1.jpg');
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.post('/update-profile', function (req, res) {
  const userObj = req.body;

  MongoClient.connect("mongodb://admin:password@mongodb", function (err, client) {
    if (err) throw err;

    const db = client.db('my-db');
    userObj['userid'] = 1;
    
    const myquery = { userid: 1 };
    const newvalues = { $set: userObj };
    
    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect to the db
  MongoClient.connect("mongodb://admin:password@mongodb", function (err, client) {
    if (err) throw err;

    const db = client.db('my-db');

    const myquery = { userid: 1 };
    
    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();
      
      // Send response
      res.send(response ? response : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
