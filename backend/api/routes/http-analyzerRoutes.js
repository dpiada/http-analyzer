
'use strict';
module.exports = function(app) {
  var httpAnalyzer = require('../controllers/http-analyzerController');
  app.route('/request')
    .post(httpAnalyzer.send_a_request);

  app.route('/request/:id')
    .get(httpAnalyzer.get_a_request_by_id);
    
};
