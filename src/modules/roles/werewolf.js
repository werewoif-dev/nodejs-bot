const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const utils = require('../../utils.js');

class Werewolf {
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
		this.nightResolver(player);

		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	teamChat(player, message) {
		for (let currentPlayer of this.playerList) {
			if (player.id != currentPlayer.id) {
				currentPlayer.chat(utils.getMessageChains(`message from ${player.nick}`, message));
			}
		}
	}

	processNight(werewolf) {
		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			this.chat('现在是晚上！请狼人决定今晚要杀的人（使用 `kill <qq>` 的格式回复）');
		});
	}

	constructor() {
		this.playerList = [];
	}
}

module.exports = Werewolf;