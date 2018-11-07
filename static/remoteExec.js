

function _executeCommand(socket,command,callback){
  var fullCommand = `${command}
exit 0
`
  socket.on('disconnect', function() {
    // La deconnexion est engendree par le exit 0 (pty exit => socket server close => socket client close )
    callback()
  });
  socket.emit('data',{t: "key", v: fullCommand });
}

function executeCommand(hostId,command,callback){
  var socket = io.connect({ query: { id: hostId } })
  socket.on('connect', function() {
    
    var first = true
    socket.on('data', function() { 
      // On attend la mire du shell avant d'envoyer la commande
      if (first){
        first = false
        _executeCommand(socket,command,callback)
      }
    })
  })
}

function copyFileToRemote(hostId,fileName,contentText,callback){
  var command = `cat <<EOF > ${fileName}
${contentText}
EOF
`
  executeCommand(hostId,command,callback)
}
