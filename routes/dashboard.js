var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var fs = require('fs');
var config = require('../config/auth');

var EVENTS_FILE = "events_data.txt";
var FEED_FILE = "feed_data.txt";

var PAGE_BDE_EPITECH = "bde.epitech.stg";

/* GET dashboard home */

router.get('/', function(req, res, next) {

  /* Get access token */
  var url_access_token = "https://graph.facebook.com/oauth/access_token?client_id=" + config.facebookAuth.clientID + "&client_secret=" + config.facebookAuth.clientSecret + "&grant_type=client_credentials";

  rp(url_access_token)
    .then(data => {

      var json = JSON.parse(data);

      if (json.access_token) {

        /* Get data pages */
        var url_access_data_feed = "https://graph.facebook.com/v2.11/" + PAGE_BDE_EPITECH + "/posts/?access_token=" + json.access_token;

        rp(url_access_data_feed)
          .then(data => {
            fs.writeFileSync(FEED_FILE, data, "UTF-8");
            
            /* Get event */
            var url_access_data_events = "https://graph.facebook.com/v2.11/" + PAGE_BDE_EPITECH + "/events/?access_token=" + json.access_token;

            rp(url_access_data_events)
              .then(data => {
                fs.writeFileSync(EVENTS_FILE, data, "UTF-8");

                var events_data = fs.readFileSync(EVENTS_FILE);
                var feed_data = fs.readFileSync(FEED_FILE);

                var events_data_obj = JSON.parse(events_data)["data"];
                var feed_data_obj = JSON.parse(feed_data)["data"];
                
                /* Get picture event */

                var fn = function asyncGetUrlPicture(event) {
                  return new Promise((resolve, reject) => {
                    var url_access_event_picture = "https://graph.facebook.com/v2.11/" + event.id + "/picture/?access_token=" + json.access_token;
                    rp({ uri: url_access_event_picture, resolveWithFullResponse: true })
                      .then(res => {
                        event.url_picture = res["request"]["uri"]["href"];                 
                        resolve(event);
                      })
                      .catch(err => {
                        reject(err);
                      })
                  });
                };

                var actions = events_data_obj.map(fn);

                var result = Promise.all(actions);

                result
                  .then((data) => {
                    res.render('dashboard/index', { 
                      events: events_data_obj,
                      feed: feed_data_obj
                    });
                  })
                  .catch(err => {})

              })
              .catch(err => {})

          })
          .catch(err => {});
      }

    })
    .catch(err => {});
});

module.exports = router;
