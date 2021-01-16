const fs = require('fs');
const path = require('path');
const YAML = require('YAML');

const configDir = path.join(__dirname, './config.yml');
const configParser = YAML.parse;

const config = configParser(fs.readFileSync(configDir).toString());

module.exports = config;