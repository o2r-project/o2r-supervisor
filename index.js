/*
 * (C) Copyright 2016 Jan Koppe.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const config = require('./config/config');
const debug = require('debug')('supervisor');

const async = require('async');
const request = require('request');
const cookie = require('cookie');

const express = require('express');
const session = require('express-session');

const app = express();

const mongoose = require('mongoose');
const User = require('./lib/model/user');
const MongoStore = require('connect-mongodb-session')(session);

mongoose.connect(config.mongo.location + config.mongo.database);
mongoose.connection.on('error', () => {
  console.error('***  Could not connect to mongodb on %s%s, ABORT!',
    config.mongo.location,
    config.mongo.database
  );
  process.exit(2);
});

// user authentication
const passport = require('passport');
passport.serializeUser((user, cb) => {
  cb(null, user.orcid);
});
passport.deserializeUser((id, cb) => {
  debug("Deserialize for %s", id);
  User.findOne({ orcid: id }, (err, user) => {
    if (err) cb(err);
    cb(null, user);
  });
});
const mongoStore = new MongoStore({
  uri: config.mongo.location + config.mongo.database,
  collection: 'sessions'
});
mongoStore.on('error', err => {
  console.error(err);
  process.exit(3);
});
app.use(session({
  secret: config.sessionsecret,
  resave: true,
  saveUninitialized: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  store: mongoStore
}));
app.use(passport.initialize());
app.use(passport.session());

// endpoints
app.get('/status', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (!req.isAuthenticated() || req.user.level < config.user.level.view_status) {
    res.status(401).send('{"error":"not authenticated or not allowed"}');
    return;
  }

  var response = {
    service: "supervisor",
    version: config.version,
    levels: config.user.level,
    mongodb: config.mongo
  };

  // collect status from other services

  // use cookie from request for authentication
  let j = request.jar();
  let requestcookies = cookie.parse(req.headers.cookie)
  let ck = request.cookie(config.sessioncookie.value + "=" + requestcookies[config.sessioncookie.value]);
  j.setCookie(ck, config.sessioncookie.url);

  async.map(config.endpoints, getStatus(j), function (err, responses) {
    response.services = responses;

    res.send(response);
  });

});

var getStatus = function (jar) {
  return function (endpoint, callback) {
    request({
      uri: endpoint,
      method: "GET",
      jar: jar,
      json: true,
      timeout: 1000
    },
      function (err, res, body) {
        debug("Retrieved status for %s: %s | error: ", endpoint, body, err);
        if (err) {
          callback(null, { endpoint: endpoint, error: err });
        }
        else {
          callback(err, body);
        }
      }
    );
  }
}

app.listen(config.net.port, () => {
  debug('supervisor v%s.%s.%s api %s listening on port %s',
    config.version.major,
    config.version.minor,
    config.version.bug,
    config.version.api,
    config.net.port
  );
});
