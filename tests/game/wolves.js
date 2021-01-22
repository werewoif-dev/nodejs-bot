const App = require('../app');
const utils = require('../utils');
const config = require('../../config');

(async () => {
	const app = new App();
	const interval = 100;
	const logger = global.game.logger;
	const setTemplate = function () {
		return global.game.setTemplate(Array.from(arguments));
	}

	const { p, g } = utils.generateSession(app, config.group, [
		1000000000,
		1000000001,
		1000000002,
		1000000003,
		1000000004,
		1000000005,
		1000000006,
		1000000007,
		1000000008,
	]);

	setTemplate('werewolf', 'werewolf', 'werewolf', 'villager', 'villager', 'villager', 'villager', 'villager');
	await utils.receiveByInterval(interval, [
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[4], 'register'],
		[g[5], 'register'],
		[g[6], 'register'],
		[g[7], 'register'],
		[g[8], 'register'],
		[g[1], 'start game'],
		[p[1], 'kill 4'],
		[g[4], 'pass'],
		[g[5], 'pass'],
		[p[3], 'boom'],
		[p[3], 'kill 5'],
		[p[1], 'kill 4'],
		[p[1], 'kill 5'],
		[g[6], 'pass'],
		[g[7], 'pass'],
		[g[8], 'pass'],
		[g[1], 'pass'],
		[g[2], 'pass'],
		[p[1], 'vote 1'],
		[p[2], 'pass'],
		[p[3], 'pass'],
		[p[4], 'pass'],
		[p[5], 'pass'],
		[p[6], 'vote 6'],
		[p[7], 'pass'],
		[p[8], 'pass'],
		[p[2], 'boom'],
		[g[1], 'stop game'],
	]);
	logger.check('werewolf:kill 1 4\nspeech 5,6,7,8,1,2,3\nwerewolf:boom 3\n' +
		'werewolf:kill 1 5\nspeech 6,7,8,1,2\nspeech 1,6\nwerewolf:boom 2');

	process.exit(0);
})();