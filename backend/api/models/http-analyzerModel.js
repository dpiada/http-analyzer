'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestsSchema = new Schema({
  url: {
    type: String,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'INFO','DUMB']
  },
  date: {
    type: Date,
  },
  statusCode:{
    type: Number
  },
  statusMessage:{
    type: String
  },
  redirectsFollowed:{
    type: Number
  },
  pathname:{
    type: String
  },
  httpVersion:{
    type: String
  },
  domain:{
    type: String
  },
  redirects:[]
});

module.exports = mongoose.model('Requests', RequestsSchema);
