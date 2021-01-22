const assert = require('assert');
const colors = require('colors/safe');

class Logger {

	push() {
		this.log.push(Array.from(arguments).join(' '));
	}

	get() {
		return this.log.join('\n');
	}

	set(messageList) {
		this.log = messageList;
	}

	reset() {
		this.log = [];
	}

	equal(target) {
		return this.get() === target;
	}

	check(target) {
		console.log(colors.brightGreen(this.get()));
		assert.strictEqual(this.get(), target);
		console.log(colors.green('=>', colors.bgBrightBlue('pass')));
	}

	constructor() {
		this.log = [];
	}
};

module.exports = Logger; 