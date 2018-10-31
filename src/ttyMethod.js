var fs = require('fs');
var logger = require('./logger');
var os = require('os');
var pty = require('node-pty');
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';


ttyMethod = function(socket,serverConfig){
  var term = pty.spawn(shell, [], {
    name: 'xterm-color',
//    cols: 80,
//    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });
  
  // handle incoming data (client -> server)
  socket.on('data', function(data) {
    if (data.t == 'key'){
      term.write(data.v);
    } else {
      //term.write('\\033[8;'+data.v.rows+';'+data.v.cols+'t')
      term.resize(data.v.cols,data.v.rows);
      //term.info(JSON.stringify(data.v));
    }
  });

  // handle connection lost
  socket.on('disconnect', function() {
    socket = null;
    term.kill()
  });

  // send buffer data to client
	term.on('data', function(data) {
    if (socket){
      return socket.emit('data', data);
    }
	});

}
module.exports = ttyMethod;
