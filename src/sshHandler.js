var fs = require('fs');
var SSHClient = require('ssh2').Client;
var socketIO = require('socket.io')

function sshHandler(app,http){
  var io = socketIO(http)

  io.on('connection', function(socket) {

    var ip = socket.handshake.query.ip
    var user = socket.handshake.query.user || 'root'
    var cert = socket.handshake.query.cert || process.env['HOME']+'/.ssh/id_rsa'
    var conn = new SSHClient();
    conn.on('ready', function() {
      //socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
      conn.shell(function(err, stream) {
        if (err)
          return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
        socket.on('data', function(data) {
          logger.info("DATA: ",data)
          stream.write(data);
        });
        stream.on('data', function(d) {
          socket.emit('data', d.toString('binary'));
        }).on('close', function() {
          conn.end();
        });
      });
    }).on('close', function() {
      socket.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
      socket.disconnect()
    }).on('error', function(err) {
      socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
      socket.disconnect()
    }).connect({
      host: ip,
      username: user,
      privateKey: fs.readFileSync(cert)
    });

  });

}

module.exports = sshHandler;
