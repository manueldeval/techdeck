require('winston-daily-rotate-file')
// Chargement de la configuration applicative
var config = require('./config');

// Logger
var  winston = require('winston')
var consoleTransport = new winston.transports.Console({
  colorize: true, 
  level: config.log_level || 'info',
  format: winston.format.printf(info => new Date().toISOString()+" "+ info.level.toLocaleUpperCase()+" "+ info.message),
})

var logger = winston.createLogger({transports:consoleTransport});

module.exports = logger;
