const express = require('express')
const app = express()
const http = require('http').Server(app)
const config = require('./src/config')
const logger = require('./src/logger')
const termHandler = require('./src/termHandler')
const pugTemplates = require('./src/pugTemplates')
const {dirname, resolve} = require('path');

if (config.content && config.content.static){
  // Le contenu de /custom/ est accessible à l'url http://xxxx:yyyy/static/
  // Ce contenu surcharge eventuellement les fichier situes dans le repertoire static.
  logger.info('Static content path: ' + config.content.static);
  app.use('/static/', express.static(config.content.static));
}
// Le contenu de /static/ est accessible à l'url http://xxxx:yyyy/static/
app.use('/static/', express.static(__dirname+'/static'));

// Enregistre des module node comme des .js accessibles
// dans le navigateur.
[ 
  'reveal', // Exemple le repertoire node_modules/reveal/ est accessible a l'url http://xxxx:yyyy/reveal/
  'vue',
  'xterm',
  'socket.io-client',
  'font-awesome'
].forEach(e => app.use("/"+e, express.static(__dirname+'/node_modules/'+e+"/")) )

// Template engine
if (config.content && config.content.slides){
  pugTemplates(app,dirname(config.content.slides))
} else {
  pugTemplates(app)
}
// Handler des communications ssh
termHandler(http)

// Demarrage du serveur
const ip = config.ip || '0.0.0.0'
const port = config.port || 3000;
http.listen(port,ip, () => logger.info('listening on '+ip+':'+port) );
