var express = require('express');
var router = express.Router();

/* GET dashboard home */

router.get('/', function(req, res, next) {
  res.render('dashboard/index');
});

module.exports = router;
