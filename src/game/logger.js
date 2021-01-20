class Logger {

	push(message) {
		this.log.push(message);
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

	constructor() {
		this.log = [];
	}
};

module.exports = Logger; 