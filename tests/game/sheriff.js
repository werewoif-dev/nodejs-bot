const App = require('../app');
const utils = require('../utils');
const config = require('../../config');

(async () => {
	const app = new App();
	const interval = 50;
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

	setTemplate(
		'werewolf', 'werewolf', 'werewolf', 'witch', 'villager', 'villager', 'villager', 'villager'
	);
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
		[p[1], 'kill 8'],
		[p[4], 'poison 2'],
		[p[1], 'raise'],
		[p[2], 'raise'],
		[p[3], 'pass'],
		[p[4], 'pass'],
		[p[5], 'raise'],
		[p[6], 'raise'],
		[p[7], 'pass'],
		[p[8], 'pass'],
		[g[1], 'No.3 boom, please'],
		[p[3], 'boom'],
		[p[1], 'kill 4'],
		[p[4], 'pass'],
		[p[1], 'raise'],
//		[p[2], 'pass'],
		[p[3], 'raise'],
		[p[4], 'pass'],
		[p[5], 'raise'],
		[p[6], 'pass'],
		[p[7], 'raise'],
//		[p[8], 'pass'],
		[g[1], 'pass'],
		[g[5], 'pass'],
		[g[7], 'pass'],
//		[p[2], 'vote 5'],
		[p[4], 'vote 7'],
		[p[6], 'vote 3'],
		[p[6], 'vote 6'],
		[p[6], 'vote 7'],
//		[p[8], 'vote 5'],
		[p[1], 'help'],
		[g[1], 'status'],
		[g[1], 'stop game']
	]);
	logger.check('werewolf:kill 1 8\nwitch:poison 4 2\nspeech 1,2,5,6\nwerewolf:boom 3\nwerewolf:kill 1 4\nwitch:pass 4\nspeech 1,5,7');

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
		[p[1], 'pass'],
		[p[4], 'pass'],
		[p[1], 'raise'],
		[p[2], 'pass'],
		[p[3], 'raise'],
		[p[4], 'pass'],
		[p[5], 'raise'],
		[p[6], 'pass'],
		[p[7], 'raise'],
		[p[8], 'pass'],
		[g[1], 'pass'],
		[g[3], 'pass'],
		[g[5], 'pass'],
		[g[7], 'pass'],
		[p[2], 'vote 5'],
		[p[4], 'vote 5'],
		[p[6], 'vote 6'],
		[p[6], 'vote 3'],
		[p[6], 'vote 7'],
		[p[8], 'vote 5'],
		[p[1], 'help'],
		[g[1], 'status'],
		[g[5], 'right'],

		[g[5], 'pass'],
		[g[6], 'pass'],
		[g[7], 'pass'],
		[g[8], 'pass'],
		[g[1], 'pass'],
		[g[2], 'pass'],
		[g[3], 'pass'],
		[g[4], 'pass'],

		[p[1], 'vote 1'],
		[p[2], 'vote 1'],
		[p[3], 'vote 1'],
		[p[4], 'vote 1'],
		[p[5], 'vote 2'],
		[p[6], 'vote 2'],
		[p[7], 'vote 2'],
		[p[8], 'vote 2']
	]);
	logger.check('werewolf:pass 1\nwitch:pass 4\nspeech 1,3,5,7\nspeech 5,6,7,8,1,2,3,4');
})();
