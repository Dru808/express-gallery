/*jshint esversion: 6*/

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'express_gallery_db',
  user: 'JasmineSlovak"'
};

const PGP = require ('pg-promise')();
const db = PGP(connection);

module.exports = db;