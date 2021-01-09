const arrayShuffle = require('array-shuffle');

const config = require('../config');

const Player = require('./modules/player');
const Werewolf = require('./modules/roles/werewolf');

class Game {

	chat(message) {
		this.bot.sendGroupMessage(message, config.group);
	}

	start() {
		arrayShuffle(this.playerList);

		// ===== just for debug =====
		for (let player of this.playerList) {
			player.setRole('werewolf');
			this.werewolf.addPlayer(player);
		}
		// ===== just for debug =====
	}

	register(id, quoteReply = undefined) {
		if (!quoteReply) {
			quoteReply = this.chat;
		}

		let registered = false;
		for (let registeredPlayer of this.playerList) {
			if (registeredPlayer.id == id) {
				registered = true;
				return;
			}
		}
		if (!registered) {
			const newPlayer = new Player(id);
			this.playerList.append(newPlayer);
			this.chat(`${newPlayer.getNick()} 注册成功！`);
			newPlayer.chat('hello！我是狼人杀 bot (*^▽^*)');
		} else {
			this.chat('注册失败，你已报名成功');
		}
	}

	registerCancel(id, quoteReply = undefined) {
		if (!quoteReply) {
			quoteReply = this.chat;
		}

		let index = -1;
		for (let i in this.playerList) {
			const registeredPlayer = this.playerList[i];
			if (registeredPlayer.id == id) {
				index = i;
				return;
			}
		}
		if (~index) {
			const currentPlayer = this.playerList[index];
			currentPlayer.chat('成功取消注册');
			this.playerList.splice(index, 1);
		}
	}

	constructor(bot) {
		this.bot = bot;
		this.started = false;
		this.playerList = [];

		this.werewolf = new Werewolf();

		this.logger = {
			listAllPlayers() {
				let messagePlain;
				if (this.playerList.length) {
					messagePlain = `已经注册的玩家有 ${this.playerList.length} 个：`
					for (let i in this.playerList) {
						const player = this.playerList[i];
						if (i) {
							messagePlain += '、';
						} else {
							messagePlain += player.nick;
						}
					}
				} else {
					messagePlain = '没有玩家注册';
				}
				this.chat(messagePlain);
			}
		}
	}
}

module.exports = Game;