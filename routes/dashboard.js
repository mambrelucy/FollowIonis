const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const fs = require('fs');
const util = require('util');

const config = require('../config/auth');

const mongoose = require('mongoose');

mongoose.createConnection('localhost', 'followionis');

var Association = require('../models/Association');
var Event = require('../models/Event');
var Feed = require('../models/Feed');

/* Get All Associations */
var get_associations = fs.readFileSync("files/associations_pages.txt");
var associations = JSON.parse(get_associations)["data"];

/* GET dashboard home */
router.get('/', function(req, res, next) {

  /* Get access token */
  var url_access_token = "https://graph.facebook.com/oauth/access_token?client_id=" + config.facebookAuth.clientID + "&client_secret=" + config.facebookAuth.clientSecret + "&grant_type=client_credentials";

  rp(url_access_token)
    .then(data => {

      var json = JSON.parse(data);

      if (json.access_token) {

        /* Fill informations associations to MongoDb */
        var getUrlPictureProfile = function asyncGetUrlPictureProfile(association) {
          return new Promise ((resolve, reject) => {
            var url_access_event_picture = "https://graph.facebook.com/v2.11/" + association.name + "/picture/?access_token=" + json.access_token;
            rp({ uri: url_access_event_picture, resolveWithFullResponse: true })
              .then(res => {
                Association.find({ name_fb: association.name }, function (err, data) {
                  if (err) throw err;
                  if (!(data.length)) {
                    var asso = new Association({
                      name_fb: association.name,
                      image_url: res["request"]["uri"]["href"]
                    });
                    var promise = asso.save(function(err) {
                      if (err) throw err;
                    })
                    promise.then(function(doc){}).catch(function(err){});         
                  }
                });
                resolve(association);
              })
              .catch(err => {
                reject(err);
              })
          });
        };

        var actions = associations.map(getUrlPictureProfile);

        var result = Promise.all(actions);

        result
          .then((data_asso) => {
            
            /* Find Id Association in Database */
            var findIdAssociation = function asyncFindIdAssociation(association) {
              return new Promise ((resolve, reject) => {
                Association.find({ name_fb: association.name }, function (err, data) {
                  console.log("data : " + JSON.stringify(data));
                  if (err) throw err;
                  if (data.length) {
                    data.forEach(function (db) {
                      association.db_id_asso = db._id.toHexString();
                      resolve(association);
                    });
                  } else {
                    reject(err);
                  }
                });
              });
            };

            var actions = associations.map(findIdAssociation);

            var result = Promise.all(actions);

            result
              .then((data_asso) => {

                /* Store feed data */
                var storeFeedAssociation = function asyncStoreFeedAssociation(association) {
                  return new Promise ((resolve, reject) => {
                    var url_access_data_feed = "https://graph.facebook.com/v2.11/" + association.name + "/posts/?access_token=" + json.access_token;
                    rp(url_access_data_feed)
                      .then(res => {
                        var data = JSON.parse(res)["data"];
                        data.forEach(function (item) {
                          Feed.find({ message: item.message }, function (err, db) {
                            if (err) throw err;
                            if (!(db.length)) {
                              if (!(item.story)) {
                                item.story = "News !";
                              }
                              var feed = new Feed({
                                story: item.story,
                                message: item.message,
                                created_time: new Date(item.created_time),
                                id_association: association.db_id_asso
                              });
                              var promise = feed.save(function(err) {
                                if (err) throw err;
                              })
                              promise.then(function(doc){}).catch(function(err){});       
                            }
                          });
                        });
                        resolve(data);
                      })
                      .catch(err => {
                        reject(err);
                      })
                  });
                };
    
                var actions = associations.map(storeFeedAssociation);
    
                var result = Promise.all(actions);
    
                result
                  .then((data_feed) => {
    
                    /* Store event data */
                    var storeEventAssociation = function asyncStoreEventAssociation(association) {
                      return new Promise ((resolve, reject) => {
                        var url_access_data_events = "https://graph.facebook.com/v2.11/" + association.name + "/events/?access_token=" + json.access_token;
                        rp(url_access_data_events)
                          .then(res => {
                            var data = JSON.parse(res)["data"];
                            data.forEach(function (item) {
                              Event.find({ story: item.name }, function (err, db) {
                                if (err) throw err;
                                if (!(db.length)) {
    
                                  /* Get Picture event */
                                  var url_access_event_picture = "https://graph.facebook.com/v2.11/" + item.id + "/picture/?access_token=" + json.access_token;
                                  rp({ uri: url_access_event_picture, resolveWithFullResponse: true })
                                    .then(res => {
                                      if (!(item.end_time)) {
                                        var event = new Event({
                                          name: item.name,
                                          image_url: res["request"]["uri"]["href"],
                                          start_time: new Date(item.start_time),
                                          id_association: association.db_id_asso
                                        });
                                      } else {
                                        var event = new Event({
                                          name: item.name,
                                          image_url: res["request"]["uri"]["href"],
                                          start_time: new Date(item.start_time),
                                          end_time: new Date(item.end_time),
                                          id_association: association.db_id_asso
                                        });
                                      }                                            
                                      var promise = event.save(function(err) {
                                        if (err) throw err;
                                      })
                                      promise.then(function(doc){}).catch(function(err){});
    
                                    })
                                    .catch(err => {
                                      reject(err);
                                    })     
                                }
                              });
                            });
                            resolve(data);
                          })
                          .catch(err => {
                            reject(err);
                          })
                      });
                    };
                    var actions = associations.map(storeEventAssociation);
    
                    var result = Promise.all(actions);
                    
                    result
                      .then((data_event) => {
                        Association.find({}, function(err, associations) {
                          Feed.find({}).sort({created_time: 'desc'}).exec(function (err, feeds) {
                            if (err) throw err;
  
                            Event.find({}).sort({start_time: 'desc'}).exec(function(err, events) {
                              if (err) throw err;
  
                              res.render('dashboard/index', {
                                associations: associations, 
                                events: events,
                                feeds: feeds
                              });
                            });
                          });
                        });
                      })
                      .catch(err => { throw err }) //end of store event data
    
                  })
                  .catch(err => { console.log("Store feed data"); throw err }) //end of store feed data


              })
              .catch(err => { console.log("Find id association in database"); throw err }) //end of find id association in database



          })
          .catch(err => { console.log("Fill informations associations to mongodb"); throw err }) //end of fill informations associations to mongodb


      } else {
        console.log("Json access token doesn't exists");
      }

    })
    .catch(err => { console.log("end"); throw err });
});

module.exports = router;
