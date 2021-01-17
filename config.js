const fs = require('fs');
const path = require('path');
const YAML = require('YAML');

const configDir = path.join(__dirname, './config.yml');
const configParser = YAML.parse;

const config = configParser(fs.readFileSync(configDir).toString());

config.query = function (path, defaultValue = undefined) {
	const keyList = path.split('.');
	let ctx = config;
	for (let key of keyList) {
		if (!Object.keys(ctx).includes(key)) {
			return defaultValue;
		}
		ctx = ctx[key];
	}
	return ctx;
}

module.exports = config;