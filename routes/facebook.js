var express = require('express');
var router = express.Router();
var passport = require('passport');

/* facebook routes */
router.get('/auth/facebook', 
  passport.authenticate('facebook', function (req, res) {
      console.log("authenticated : " + req.isAuthenticated());
      if (req.isAuthenticated()) {
        return (next());
    }
  })
);

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
        successRedirect : '/dashboard',
        failureRedirect : '/errortest'
    }),
    function(req, res) {
        res.redirect('/');
    }
);

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/errortest');
});

module.exports = router;