var requireAll = require('require-all-to-camel');

exports.config = require(__dirname + '/config/environment.js');
exports.data  = require(__dirname +'/lib/data/');
exports.database  = require(__dirname +'/lib/data/sequelize.js');
exports.models = requireAll(__dirname +'/lib/data/models/');
exports.api = require(__dirname+'/lib/api.js');
exports.errors = requireAll(__dirname+'/lib/errors/');
exports.validator = require(__dirname+'/lib/validator.js');
exports.server = require(__dirname+'/lib/app.js');
exports.processes = require(__dirname+'/lib/processes/');
exports.logger = require(__dirname+'/lib/data/logs.js');
exports.features = require(__dirname+'/lib/features');

var initializers = requireAll(__dirname+'/config/initializers/');

for (i in initializers) {
  initializers[i](exports);
}

require(__dirname+'/Gatewaydfile')(exports);

