var socketIO = require('socket.io');
var logger = require('./logger');
var sshMethod = require('./sshMethod');
var ttyMethod = require('./ttyMethod');
var config = require('./config')

function termHandler(http){
  var io = socketIO(http)

  io.on('connection', function(socket) {

    if (!socket.handshake.query.id){
      logger.warn("No id found in socketio request.");
      return;
    }
    var id = socket.handshake.query.id;
    if (!config.servers[id]){
      logger.warn("No server defined for id "+id);
      return;
    }
    var serverConfiguration = config.servers[id];

    if (serverConfiguration.method == 'ssh'){
      sshMethod(socket,serverConfiguration);
    } else if (serverConfiguration.method == 'tty'){
      ttyMethod(socket,serverConfiguration);
    } else {
      logger.warn("Unknown connection method requested: " + serverConfiguration.method);
    }

  });

}

module.exports = termHandler;
