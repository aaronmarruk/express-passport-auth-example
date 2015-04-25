var mongoose = require('mongoose'),
	dbConfig = require('./db-config.js')

var connect = function () {
 	var options = { server: { socketOptions: { keepAlive: 1 } } };
 	mongoose.connect(dbConfig.dbURL);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);