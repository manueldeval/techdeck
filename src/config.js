const Handlebars = require('handlebars');
const fs = require('fs');
const YAML = require('yaml');
Handlebars.registerHelper('getOrElse', function (a, b) {return a ? a : b;});

const configLoader = function(path){
  const rawYaml = fs.readFileSync(path,{encoding:'utf8'});
  var template = Handlebars.compile(rawYaml);
  var yaml = template({ env: process.env });
  return YAML.parse(yaml);
}

// Chargement de la configuration
var args = process.argv.slice(2);
var argConfig = args[0];
const config = configLoader(argConfig || process.env.CONFIG || './config.yml')

module.exports = config;
