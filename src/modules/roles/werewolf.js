const Mirai = require('node-mirai-sdk');
const { Plain } = Mirai.MessageComponent;

const Role = require('../role');
const utils = require('../../utils.js');

class Werewolf extends Role {
	log() {
		console.log('[ROLE]', 'Werewolf', ...arguments);
	}

	getDisplayName() {
		return [Plain('狼人')];
	}

	teamChat(player, message) {
		if (!player || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			player.chat('teamChat 命令不合法');
			return;
		}

		this.log('Team Chat', player.nick, message);
		for (let currentPlayer of this.playerList) {
			if (player.id != currentPlayer.id) {
				currentPlayer.chat(utils.getMessageChains(`(message from ${player.nick}) `, message));
			}
		}
	}

	kill(killer, targetPlayer) {
		if (!killer || !targetPlayer || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			killer.chat('kill 命令不合法');
			return;
		}

		this.log('Kill', targetPlayer.nick, 'by', killer.nick);
		for (let currentPlayer of this.playerList) {
			currentPlayer.chat(utils.getMessageChains(`${killer.nick} 决定杀害 ${targetPlayer.nick}`));
		}

		if (targetPlayer.id === -1) {
			targetPlayer = null;
		}
		this.nightResolver(targetPlayer);

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';

		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			this.chat(`现在是第 ${roundId} 个晚上！请狼人决定今晚要杀的人`);
		});
	}

	constructor(game) {
		super(game);
	}
}

module.exports = Werewolf;