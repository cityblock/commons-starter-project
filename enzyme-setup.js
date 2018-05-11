var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
var Knex = require('knex');
var Objection = require('objection');
// Needed to run tests related to react-PDF generation
require('regenerator-runtime/runtime');

Enzyme.configure({ adapter: new Adapter() });

var knexConfig = require('./server/models/knexfile');
var knex = Knex(knexConfig.test);
Objection.Model.knex(knex);
