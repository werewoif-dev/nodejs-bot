const Mirai = require('node-mirai-sdk');
const { Plain } = Mirai.MessageComponent;

const utils = require('../../utils.js');

class Werewolf {
	log() {
		console.log('[ROLE]', 'Werewolf', ...arguments);
	}

	getDisplayName() {
		return [Plain('狼人')];
	}

	addPlayer(player) {
		this.playerList.push(player);
	}

	chat(message) {
		for (let currentPlayer of this.playerList) {
			currentPlayer.chat(message);
		}
	}

	kill(player) {
		if (!player || !this.nightResolver) {
			return;
		}

		console.log('Kill', player.id);
		this.nightResolver(player);

		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	teamChat(player, message) {
		this.log('Team Chat', player.id, message);
		for (let currentPlayer of this.playerList) {
			if (player.id != currentPlayer.id) {
				currentPlayer.chat(utils.getMessageChains(`(message from ${player.nick}) `, message));
			}
		}
	}

	processNight(roundId, playerList) {
		this.roundId = roundId;
		this.roundType = 'night';
		this.playerList = playerList;

		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			this.chat('现在是晚上！请狼人决定今晚要杀的人（使用 `kill <qq>` 的格式回复）');
		});
	}

	constructor() {
		this.roundId = null;
		this.roundType = null;
		this.playerList = [];
	}
}

module.exports = Werewolf;