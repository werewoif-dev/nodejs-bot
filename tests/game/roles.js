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
		1000000001,
		1000000002,
		1000000003,
		1000000004,
		1000000005,
		1000000006,
	]);

	// 狼
	setTemplate('werewolf', 'villager', 'villager', 'villager');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[0], 'start game'],
		[p[0], 'kill 1'],
		[g[0], 'stop game'],
	]);
	logger.check('werewolf:kill 1 1');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[0], 'start game'],
		[p[0], 'kill null'],
		[p[0], 'kill 2'],
		[g[0], 'stop game'],
	]);
	logger.check('werewolf:kill 1 2\nspeech 3,4,1');
	setTemplate('werewolf', 'werewolf', 'werewolf', 'villager');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[0], 'start game'],
		[p[0], '# hello'],
		[p[1], '# hi'],
		[p[2], '# how are you'],
		[p[0], 'kill 4'],
	]);
	logger.check('werewolf:kill 1 4');

	// 女巫
	setTemplate('werewolf', 'witch', 'villager', 'villager', 'villager');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[4], 'register'],
		[g[0], 'start game'],
		[p[0], 'kill 2'],
		[p[1], 'save 2'],
		[g[0], 'stop game'],
	]);
	logger.check('werewolf:kill 1 2\nwitch:save 2 2\nspeech 1,2,3,4,5');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[4], 'register'],
		[g[0], 'start game'],
		[p[0], 'kill 2'],
		[p[1], 'poison 3'],
		[g[0], 'stop game'],
	]);
	logger.check('werewolf:kill 1 2\nwitch:poison 2 3\nspeech 1,4,5');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[4], 'register'],
		[g[0], 'start game'],
		[p[0], 'kill 2'],
		[p[1], 'pass'],
		[g[0], 'stop game'],
	]);
	logger.check('werewolf:kill 1 2\nwitch:pass 2\nspeech 3,4,5,1')

	// 预言家
	setTemplate('seer', 'werewolf', 'witch', 'villager');
	{
		let target = [true, false, true, true];
		for (let i = 1; i <= target.length; i++) {
			await utils.receiveByInterval(interval, [
				[g[0], 'register'],
				[g[1], 'register'],
				[g[2], 'register'],
				[g[3], 'register'],
				[g[0], 'start game'],
				[p[1], 'pass'],
				[p[2], 'pass'],
				[p[0], `suspect ${i}`],
				[g[0], 'stop game'],
			]);
			logger.check(`werewolf:pass 2\nwitch:pass 3\nseer:suspect 1 ${i} ${i == 2 ? "bad" : "good"}\nspeech 1,2,3,4`);
		}
	}

	// 猎人
	setTemplate('werewolf', 'hunter', 'villager', 'villager');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[0], 'start game'],
		[p[0], 'kill 2'],
		[p[1], 'shoot 1'],
	]);
	logger.check('werewolf:kill 1 2\nhunter:shoot 2 1');
	await utils.receiveByInterval(interval, [
		[g[0], 'register'],
		[g[1], 'register'],
		[g[2], 'register'],
		[g[3], 'register'],
		[g[0], 'start game'],
		[p[0], 'pass'],
		[g[0], 'pass'],
		[g[1], 'pass'],
		[g[2], 'pass'],
		[g[3], 'pass'],
		[p[0], 'vote 2'],
		[p[1], 'vote 2'],
		[p[2], 'vote 2'],
		[p[3], 'vote 2'],
		[p[1], 'shoot 1'],
	]);
	logger.check('werewolf:pass 1\nspeech 1,2,3,4\nhunter:shoot 2 1');

  process.exit(0);
})();