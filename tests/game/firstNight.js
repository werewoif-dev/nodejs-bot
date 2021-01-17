const { MockedApp } = require('koishi-test-utils');

const utils = require('../utils');
const config = require('../../config');

const app = new MockedApp();
app.test = true;
app.plugin(require('../../src/game/index'));

try {
	(async () => {
		const { p, g } = utils.generateSession(app, config.group, [
			1000000001,
			1000000002,
			1000000003,
			1000000004,
			1000000005,
			1000000006,
		]);

		// 狼人女巫板子 [werewolf, witch]
		await utils.receiveByInterval(200, [
			[g[0], 'register'],
			[g[1], 'register'],
			[g[0], 'start game'],
			[p[0], 'kill 1'],
			[p[1], 'pass'],
		]);
		await utils.receiveByInterval(200, [
			[g[0], 'register'],
			[g[1], 'register'],
			[g[0], 'start game'],
			[p[0], 'kill 1'],
			[p[1], 'save 1'],
		]);

		// 狼预女板子 [werewolf, villager, seer, witch]
		await utils.receiveByInterval(200, [
			[g[0], 'register'],
			[g[1], 'register'],
			[g[2], 'register'],
			[g[3], 'register'],
			[g[0], 'start game'],
			[p[0], 'kill 1'],
			[p[3], 'save 1'],
			[p[2], 'suspect 1'],
			[g[0], 'stop game'],
		]);

	})();
} catch (err) {
	console.error(err);
	console.log('ERROR!!!');
}