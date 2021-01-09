const fs = require('fs');
const path = require('path');
const YAML = require('YAML');

const config_dir = path.join(__dirname, '../config.yml');
const config_parser = YAML.parse;

const config = config_parser(fs.readFileSync(config_dir).toString());

module.exports = config;