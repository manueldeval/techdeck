const {accessSync, constants: {R_OK}} = require('fs');
const {dirname, resolve} = require('path');
const config = require('./config');
var logger = require('./logger');

const exists = filename => {
  try {
    accessSync(filename, R_OK);
    return true;
  } catch (err) {
    return false;
  }
};

function MultiplePathsPlugin({paths = []}) {
  return {
    name: 'multiplePaths',
    resolve(filename, source) {
      let out;

      if (filename[0] === '/') {
        filename = filename.substr(1);
        if (!paths.some(path => exists(out = resolve(path, filename)))) {
          throw new Error(`${filename} cannot be found in any paths`);
        }
      } else {
        if (!source) {
          throw new Error('the "filename" option is required to use includes and extends with "relative" paths');
        }

        out = resolve(dirname(source), filename);
      }

      return out;
    }
  };
}

const initPug = function(app,customSlides) {
  // Moteur de templates
  app.locals.pretty = true;
  app.locals.basedir = __dirname + '/../views';
  app.locals.plugins= [
    MultiplePathsPlugin({
      paths: customSlides?[customSlides, 'views']:['views']
    })
  ]
  app.set('view engine', 'pug');
  app.set('views',customSlides?[customSlides,__dirname + '/../views']:[__dirname + '/../views']);

  // Enregistrement des routes 
  if (config.routes){
    config.routes.forEach(route => {
      logger.info("Registering "+route.url+" => "+route.template)
      app.get(route.url,  (req, res) => {
        res.render(route.template,{ vars: config.vars, params: req.query })
      });
    });
  }
}

module.exports = initPug;
