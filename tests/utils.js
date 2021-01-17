const sleep = require('sleep-promise');

const utils = {
	generateSession(app, group, idList) {
		const playerSessions = idList.map(id => app.session(id));
		const groupSessions = idList.map(id => app.session(id, group));
		return {
			p: playerSessions,
			g: groupSessions,
		};
	},

	async receiveByInterval(interval, data) {
		for(let item of data) {
			const session = item[0];
			const message = item[1];
			await session.receive(message);
			await sleep(interval);
		}
	}
};

module.exports = utils;