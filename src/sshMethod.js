var fs = require('fs');
var SSHClient = require('ssh2').Client;
var logger = require('./logger');

sshMethod = function(socket,serverConfig){
  var conn = new SSHClient();

  var sshOptions = {
    host: serverConfig.ip,
    port: serverConfig.port || 22,
    username: serverConfig.user
  }

  if (serverConfig.privateKey){
    sshOptions.privateKey = fs.readFileSync(serverConfig.privateKey);
  } else if (serverConfig.password){
    sshOptions.password = serverConfig.password;
  } else {
    logger.error("The server "+serverConfig.ip+ " has neither a password, nor a privatekey.");
    return
  }

  conn.on('ready', function() {
    //socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
    conn.shell(function(err, stream) {
      if (err){
        return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
      } 

      socket.on('data', function(data,fn) {
        if (data.t == 'key'){
          stream.write(data.v);
        } else {
          stream.setWindow(data.v.rows,data.v.cols)
          logger.info(JSON.stringify(data.v));
        }
        if (fn){
          fn("ok")
        }
      });

      stream.on('data', function(d) {
        socket.emit('data', d.toString('binary'));
      }).on('close', function() {
          conn.end();
      });

    });
  }).on('close', function() {
    socket.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
    if (socket){
      socket.disconnect()
    }
  }).on('error', function(err) {
    socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
    if (socket){
      socket.disconnect()
    }
  }).connect(sshOptions);
}
module.exports = sshMethod;
