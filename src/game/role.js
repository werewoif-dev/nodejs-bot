const sleep = require('sleep-promise');

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

	send(message) {
		for (let currentPlayer of this.playerList) {
			currentPlayer.send(message);
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

	async help(player) {
		if (!this.helpMessage || !this.helpMessage.length) {
			player.send('当前角色暂时没有帮助信息');
			return;
		}

		for (let message of this.helpMessage) {
			await player.send(message);
			await sleep(100);
		}
	}

	getName() {
		return this.name || this.displayName.replace(/\[CQ.+?\]/g, '');
	}

	getDisplayName() {
		return this.displayName || this.name;
	}

	constructor(game) {
		this.game = game;
		this.sendGroup = (message) => this.game.sendGroup(message);

		this.roundId = null;
		this.roundType = null;

		this.playerList = [];

	}
}

module.exports = Role;