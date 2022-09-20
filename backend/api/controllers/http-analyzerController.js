'use strict';

const rp = require('request-promise');
const mongoose = require('mongoose'),
  Requests = mongoose.model('Requests');


exports.send_a_request = function(req, res) {
  let url = req.body.url;
  let method = req.body.method;

  const options = {
    url: url,
    method: method,
    followRedirect: true,
    resolveWithFullResponse: true
  };

  rp(options)
    .then(function (response) {
      let infos = {
        url: options.url,
        pathname: response.request.uri.pathname,
        method: options.method,
        date: response.headers.date,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        httpVersion: "HTTP "+response.httpVersion,
        domain: response.connection.servername,
        redirectsFollowed: response.request._redirect.redirectsFollowed,
        redirects: response.request._redirect.redirects
      }

      const new_request = new Requests(infos);
      new_request.save( function(err, request) {
        console.log("writing on db request")
        if (err) {
          console.log("failed to write")
           res.sendStatus(500);
        }
        else{
          infos = {
            id:request._id,
            url: options.url,
            pathname: response.request.uri.pathname,
            method: options.method,
            date: response.headers.date,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            redirectsFollowed: response.request._redirect.redirectsFollowed,
            redirects: response.request._redirect.redirects,
            httpVersion: "HTTP "+ response.httpVersion,
            domain: response.connection.servername
          }
          console.log("save with success on db - id: " + infos.id)
           res.send(infos);
        }
        })
    })
    .catch(function (error) {
      if(error.cause.code === 'ENOTFOUND'){
           res.sendStatus(404);
      }else{
          res.sendStatus(400);
      }
    });
};

exports.get_a_request_by_id = function(req, res) {
  Requests.findById(req.params.id, function(err, request) {
    console.log("arrived request to find " + req.params.id)
    if (err){
      console.log("not found "+  req.params.id)
      res.sendStatus(404)
    }
    else{
      console.log("found "+  req.params.id)
      res.send(request);
    }
  });
};
