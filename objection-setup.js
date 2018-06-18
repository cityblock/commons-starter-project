var Knex = require('knex');
var Objection = require('objection');
var knexConfig = require('./server/models/knexfile');
var knex = Knex(knexConfig.test);
Objection.Model.knex(knex);
