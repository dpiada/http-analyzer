'strict'

const mongoose = require('mongoose');

const express = require('express'),
  app = express(),
  port = 3000,
  request = require('./api/models/http-analyzerModel'),
  bodyParser = require('body-parser');

const cors = require('cors');
app.use(cors());

console.log("in connection...")
console.log("wait few minutes")
const uri = 'mongodb+srv://http-analyzer-user:Ozh25mOnvIxKOhRv@cluster0.ajbbd.mongodb.net/http-analyzer-db?retryWrites=true&w=majority'
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('MongoDB Connected…')
}).catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/http-analyzerRoutes');
routes(app);

app.listen(port);
console.log('http-analyzer RESTful API server started on: ' + port);
