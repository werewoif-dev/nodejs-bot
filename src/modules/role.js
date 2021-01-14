const utils = require('../utils');

class Role {

	addPlayer(player) {
		this.playerList.push(player);
	}

	removePlayer(player) {
		let index = -1;
		for (let i in this.playerList) {
			const currentPlayer = this.playerList[i];
			if (currentPlayer.id == player.id) {
				index = i;
				break;
			}
		}

		if (index !== -1) {
			this.playerList.splice(index, 1);
		} else {
			console.error('ERROR! No such player to remove.');
		}
	}

	resetPlayer() {
		while (this.playerList.length) {
			this.playerList.pop();
		}
	}

	chat(message) {
		for (let currentPlayer of this.playerList) {
			currentPlayer.chat(message);
		}
	}

	isAlive() {
		for (let currentPlayer of this.playerList) {
			if (currentPlayer.alive) {
				return true;
			}
		}
		return false;
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';
		console.warn('WARN! Function `processNight` undefined.');
	}

	help(player) {
		if (!this.helpMessage || !this.helpMessage.length) {
			player.chat('当前角色暂时没有帮助信息');
			return;
		}

		utils.chatByInterval(this.player.chat, this.helpMessage);
	}

	constructor(game) {
		this.game = game;

		this.roundId = null;
		this.roundType = null;

		this.playerList = [];
	}
}

module.exports = Role;