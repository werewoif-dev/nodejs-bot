const Role = require('../role');
const utils = require('../../utils.js');

class Werewolf extends Role {
	log() {
		console.log('[ROLE]', 'Werewolf', ...arguments);
	}

	teamChat(player, message) {
		if (!player || !player.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			player.send('teamChat 命令不合法');
			return;
		}

		this.log('Team Chat', player.displayName, message);
		for (let currentPlayer of this.playerList) {
			if (player.id != currentPlayer.id) {
				currentPlayer.send(`(${player.displayName}) ${utils.encodeMessage(message)}`);
			}
		}
	}

	kill(killer, targetPlayer) {
		if (!killer || !killer.alive || !targetPlayer || !targetPlayer.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			killer.send('kill 命令不合法');
			return;
		}

		this.log('Kill', targetPlayer.displayName, 'by', killer.displayName);
		for (let currentPlayer of this.playerList) {
			currentPlayer.send(`${killer.displayName} 决定杀害 ${targetPlayer.displayName}`);
		}

		this.nightResolver(targetPlayer);

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	pass(player) {
		if (!player || !player.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			player.send('pass 命令不合法');
			return;
		}

		this.log('Pass', 'by', player.displayName);
		for (let currentPlayer of this.playerList) {
			currentPlayer.send(`${player.displayName} 决定跳过本回合`);
		}

		this.nightResolver(null);

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';

		this.sendGroup('狼人正在决策中...');

		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			this.send(`现在是第 ${roundId} 个晚上！请狼人决定今晚要杀的人`);
		});
	}

	constructor(game) {
		super(game);

		this.name = '狼人';

		this.helpMessage = [
			'# <message> 或 chat <message>：可以进行队内交流',
			'kill <player>：决定今晚刀的人',
			'pass：跳过今晚刀人回合',
			'注意：使用 kill 或 pass 命令后，操作回合立刻结束；操作回合结束后狼人没有内部交流权限。'
		];
	}
}

module.exports = Werewolf;