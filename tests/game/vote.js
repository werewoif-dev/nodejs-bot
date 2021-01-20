const { MockedApp } = require('koishi-test-utils');

const utils = require('../utils');
const config = require('../../config');

const app = new MockedApp();
app.test = true;
app.plugin(require('../../src/game/index'));

try {
	(async () => {
		const interval = 50;
		const { p, g } = utils.generateSession(app, config.group, [
			1000000001,
			1000000002,
			1000000003,
			1000000004,
			1000000005,
			1000000006,
		]);

		global.game.setTemplate(['werewolf', 'werewolf', 'villager', 'villager', 'villager', 'villager']);
		await utils.receiveByInterval(interval, [
			[g[0], 'register'],
			[g[1], 'register'],
			[g[2], 'register'],
			[g[3], 'register'],
			[g[4], 'register'],
			[g[5], 'register'],
			[g[0], 'start game'],
			[p[0], 'pass'],
			[p[0], 'vote 1'],
			[p[1], 'vote 1'],
			[p[2], 'vote 1'],
			[p[3], 'vote 2'],
			[p[4], 'vote 2'],
			[p[5], 'vote 2'],
			[p[0], 'vote 1'],
			[p[1], 'vote 1'],
			[p[2], 'vote 2'],
			[p[3], 'vote 2'],
			[p[4], 'vote 2'],
			[p[5], 'vote 2'],
			[g[0], 'stop game'],
		]);

	})();
} catch (err) {
	console.error(err);
	console.log('ERROR!!!');
}