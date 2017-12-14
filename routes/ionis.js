var express = require('express');
var router = express.Router();

/* POST form data ionis */
router.post('/', function(req, res, next) {
  var EpitechAPIConnector = require('epitech-api').EpitechAPIConnector;
  var connector = new EpitechAPIConnector(req.body.user, req.body.pass);
  var callbackSuccess = function (jsonData) {
      res.redirect('/fb/auth/facebook');
  };
  var callbackFailure = function (error, response) {
      console.log('User is not connected');
  };
  connector.signIn(callbackSuccess, callbackFailure);
});

module.exports = router;
