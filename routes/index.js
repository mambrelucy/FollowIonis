var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {
  res.redirect('/fb/auth/facebook');
});

router.get('/errortest', function(req, res, next) {
  res.send("ERROOOOOR");
});

module.exports = router;
