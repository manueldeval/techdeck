
function sendContentToRemote(socket,fileName,contentText,callback){
  var fullCommand = `cat <<EOF > ${fileName}
${contentText}
EOF
exit 0
`

  socket.on('disconnect', function() {
    // La deconnexion est engendree par le exit 0 (pty exit => socket server close => socket client close )
    callback()
  });

  socket.emit('data',{t: "key", v: fullCommand });
}

function copyFileToRemote(hostId,fileName,contentText,callback){
  var socket = io.connect({ query: { id: hostId } })
  socket.on('connect', function() {
    
    var first = true
    socket.on('data', function(data) { 
      if (first){
        first = false
        sendContentToRemote(socket,fileName,contentText,callback)
      }
    })
  })
}