const { MockedApp } = require('koishi-test-utils');

class TesterApp extends MockedApp {
	constructor() {
		super();
		this.test = true;
		this.plugin(require('../src/game/index'));
	}
}

process.on('unhandledRejection', error => {
  console.error(error.message);
  process.exit(1);
});

module.exports = TesterApp;