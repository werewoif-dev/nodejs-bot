const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const arrayShuffle = require('array-shuffle');
const sleep = require('sleep-promise');

const utils = require('../utils');
const config = require('../config');

const Player = require('./player');
const Werewolf = require('./roles/werewolf');

class Game {

	chat(message) {
		if (typeof (message) === 'string') {
			message = [Plain(message)];
		}
		console.log('[CHAT]', 'Group', message);
		this.bot.sendGroupMessage(message, config.group);
	}

	getPlayer(id) {
		for (let player of this.playerList) {
			if (player.id === parseInt(id)) {
				return player;
			}
		}
		return null;
	}

	setRole(player, role) {
		player.setRole(role);
		this.roles[role].addPlayer(player);
		player.chat(utils.getMessageChains('游戏开始！你的角色是 ', this.roles[role].getDisplayName()));
	}

	async processNight(roundId) {
		this.chat(`第 ${roundId} 个晚上开始了。`);
		const killedPlayer = await this.roles.werewolf.processNight(roundId, this.playerList);

		this.chat(`第 ${roundId} 个晚上结束了。`);
		await sleep(100);

		this.chat([Plain('这个晚上 '), At(killedPlayer.id), Plain(' 死了')]);
		await sleep(100);

		this.chat('bot 目前只写到了这里，剩下的还在路上');
	}

	start() {
		arrayShuffle(this.playerList);

		// ===== just for debug =====
		for (let player of this.playerList) {
			this.setRole(player, 'werewolf');
		}
		// ===== just for debug =====

		this.started = true;
		this.processNight(1);
	}

	register(id) {
		console.log('[GAME]', 'Register', id);
		let registered = false;
		for (let registeredPlayer of this.playerList) {
			if (registeredPlayer.id == id) {
				registered = true;
				break;
			}
		}

		if (!registered) {
			const currentPlayer = new Player(id);
			this.playerList.push(currentPlayer);
			this.chat([At(currentPlayer.id), Plain(` 玩家 ${currentPlayer.getNick()} 注册成功！`)]);
			currentPlayer.chat('hello！我是狼人杀 bot (*^▽^*)');
		} else {
			this.chat([At(id), Plain(' 注册失败，你已经成功报名。')]);
		}

		this.logger.listAllPlayers();
	}

	registerCancel(id) {
		console.log('[GAME]', 'Register Cancel', id);
		let index = -1;
		for (let i in this.playerList) {
			const registeredPlayer = this.playerList[i];
			if (registeredPlayer.id == id) {
				index = i;
				break;
			}
		}

		console.log('>>', index);
		if (~index) {
			this.chat([At(id), Plain(' 成功取消注册')]);
			this.playerList.splice(index, 1);
		} else {
			this.chat([At(id), Plain(' 取消注册失败，你尚未注册成功。')]);
		}

		this.logger.listAllPlayers();
	}

	constructor(bot) {
		this.bot = bot;
		this.started = false;
		this.playerList = [];

		this.roles = {
			werewolf: new Werewolf(),
		};

		this.logger = {
			listAllPlayers: () => {
				let messageChain = [];
				if (this.playerList.length) {
					messageChain.push(Plain(`已经注册的玩家有 ${this.playerList.length} 个：\n`));
					for (let i in this.playerList) {
						const player = this.playerList[i];
						messageChain.push(Plain(`${i}. ${player.nick}`));
						messageChain.push(At(player.id));
						messageChain.push(Plain('\n'));
					}
				} else {
					messageChain.push(Plain('当前没有玩家注册'));
				}
				this.chat(messageChain);
			}
		}
	}
}

module.exports = Game;