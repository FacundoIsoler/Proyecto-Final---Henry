const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const suppliers = require("./routes/suppliers")
const services = require("./routes/services")

require('./db.js');

const server = express();

server.name = 'API';

server.use(express.urlencoded({extended: true, limit: '50mb'}));
server.use(express.json({limit: '50mb'}));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', 'http//localhost3000');
  res.header('Access-Control-Allow-Credentials','true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes);
server.use("/suppliers", suppliers)
server.use("/services", services)

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.err(err);
  res.status(status).send(message);
})

module.exports = server;