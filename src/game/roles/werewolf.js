const Role = require('../role');
const utils = require('../utils');
const config = require('../../../config');

class Werewolf extends Role {
	async onGameStart() {
		if (!this.isActive()) {
			return;
		}

		let message = '本局游戏中的狼有：';
		for (const player of this.playerList) {
			message += '\n' + player.displayName;
		}
		await this.send(message);
	}

	chat(player, message) {
		if (!player || !player.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			return player.send('chat 命令不合法');
		}

		this.log('Team Chat', player.displayName, message);
		for (const currentPlayer of this.playerList) {
			if (player.id != currentPlayer.id && currentPlayer.alive) {
				currentPlayer.send(`(${player.displayName}) ${utils.encodeMessage(message)}`);
			}
		}
	}

	kill(player, targetPlayer) {
		if (!player || !player.alive || !targetPlayer || !targetPlayer.alive || !this.nightResolver) {
			return player.send('kill 命令不合法');
		}

		for (const currentPlayer of this.playerList) {
			currentPlayer.send(`${player.displayName} 决定杀害 ${targetPlayer.displayName}`);
		}
		this.killedPlayer = targetPlayer;

		this.log('Kill', targetPlayer.displayName, '(by ' + player.displayName + ')');
		this.logger.push('werewolf:kill', player.place, targetPlayer.place);

		this.nightResolver();
		this.endTurn();
	}

	pass(player) {
		if (!player || !player.alive || !this.nightResolver) {
			return player.send('pass 命令不合法');
		}

		for (const currentPlayer of this.playerList) {
			currentPlayer.send(`${player.displayName} 决定跳过本回合`);
		}

		this.log('pass', '(by ' + player.displayName + ')');
		this.logger.push('werewolf:pass', player.place);

		this.nightResolver();
		this.endTurn();
	}

	async boom(player) {
		if (!player || !player.alive || !this.game.speech.promise) {
			return player.send('boom 命令不合法');
		}

		this.log('boom', player.displayName);
		this.logger.push('werewolf:boom', player.place);

		player.alive = false;
		await this.game.processKilled(player);

		await this.sendGroup(`${player.displayName} 自爆`);
		await this.game.speech.stop(player);
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';

		this.killedPlayer = null;

		return new Promise((resolve) => {
			if (!this.isActive()) {
				resolve();
				return;
			}

			this.nightResolver = resolve;
			this.setTimeLimit(config.query('timeLimit.skill.night.werewolf'), this.nightResolver);

			this.sendGroup('狼人正在决策中...');
			this.send(`现在是第 ${roundId} 个晚上！请狼人决定今晚要杀的人`);
		});
	}

	constructor(game) {
		super(game);

		this.name = 'werewolf';
		this.displayName = '狼人';
		this.commands = this.commands.concat(['boom', 'kill', 'pass']);

		this.helpMessage = [
			'# <message> 或 chat <message>：可以进行队内交流',
			'kill <player>：决定今晚刀的人',
			'pass：跳过今晚刀人回合',
			'boom：自爆，需在发言回合使用，自身出局且游戏直接进入黑夜',
			'注意：使用 kill 或 pass 命令后，操作回合立刻结束；操作回合结束后狼人没有内部交流权限。'
		];
	}
}

module.exports = Werewolf;