const express = require('express');
const router = express.Router();
const passport = require('passport');

/* facebook routes */
router.get('/auth/facebook', 
  passport.authenticate('facebook', function (req, res) {
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
        res.redirect('/errortest');
    }
);

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/errortest');
});

module.exports = router;