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

		// 狼
		global.game.setTemplate(['werewolf', 'villager', 'villager', 'villager']);
		await utils.receiveByInterval(interval, [
			[g[0], 'register'],
			[g[1], 'register'],
			[g[2], 'register'],
			[g[3], 'register'],
			[g[0], 'start game'],
			[p[0], 'kill 1'],
			[g[0], 'stop game'],
		]);
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
		global.game.setTemplate(['werewolf', 'werewolf', 'werewolf', 'villager']);
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

		// 女巫
		global.game.setTemplate(['werewolf', 'witch', 'villager', 'villager', 'villager']);
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

		// 预言家
		global.game.setTemplate(['seer', 'werewolf', 'witch', 'villager']);
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
			}
		}

		// 猎人
		global.game.setTemplate(['werewolf', 'hunter', 'villager', 'villager']);
		await utils.receiveByInterval(interval, [
			[g[0], 'register'],
			[g[1], 'register'],
			[g[2], 'register'],
			[g[3], 'register'],
			[g[0], 'start game'],
			[p[0], 'kill 2'],
			[p[1], 'shoot 1'],
		]);
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
	})();
} catch (err) {
	console.error(err);
	console.log('ERROR!!!');
}