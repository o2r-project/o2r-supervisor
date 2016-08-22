/*
 * (C) Copyright 2016 o2r project.
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
var c = {};
c.version = {};
c.net = {};
c.mongo = {};
var env = process.env;

// Information about bouncer
c.version.major  = 0;
c.version.minor  = 2;
c.version.bug    = 0;
c.version.api    = 1;

// network & database
c.net.port         = env.SUPERVISOR_PORT || 8085;
c.mongo.location   = env.SUPERVISOR_MONGODB || 'mongodb://localhost/';
c.mongo.database   = env.SUPERVISOR_MONGODB_DATABASE || 'muncher';

// fix mongo location if trailing slash was omitted
if (c.mongo.location[c.mongo.location.length-1] !== '/') {
  c.mongo.location += '/';
}

// session secret
c.sessionsecret = env.SESSION_SECRET || 'o2r';
c.sessioncookie = {};
c.sessioncookie.value = env.SUPERVISOR_SESSION_COOKIE || 'connect.sid';
c.sessioncookie.url = env.SUPERVISOR_SESSION_COOKIE_URL || 'http://localhost';

// user levels
c.user = {};
c.user.level = {};
c.user.level.view_status = 500;

module.exports = c;
