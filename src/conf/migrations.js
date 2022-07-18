const migration = require('mysql-migrations');
const database = require('./database');

const database = new database();

migration.init(database.connection, __dirname + '/migrations');