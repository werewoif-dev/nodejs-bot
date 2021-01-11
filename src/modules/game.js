const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const shuffle = require('shuffle-array');
const sleep = require('sleep-promise');

const utils = require('../utils');
const config = require('../config');

const Player = require('./player');
const Voter = require('./voter');
const Seer = require('./roles/seer');
const Witch = require('./roles/witch');
const Villager = require('./roles/villager');
const Werewolf = require('./roles/werewolf');

class Game {

	log() {
		console.log('[GAME]', ...arguments);
	}

	chat(message) {
		if (typeof (message) === 'string') {
			message = [Plain(message)];
		}
		console.log('[CHAT]', 'Group', message);
		this.bot.sendGroupMessage(message, config.group);
	}

	addPlayer(player) {
		this.playerList.push(player);
	}

	removePlayer(player) {
		let index = -1;
		for (let i in this.playerList) {
			const registeredPlayer = this.playerList[i];
			if (registeredPlayer.id == player.id) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			this.playerList.splice(index, 1);
			return true;
		}
		return false;
	}

	getPlayer(input) {
		for (let player of this.playerList) {
			if (player.id === parseInt(input)) {
				return player;
			}
		}
		for (let player of this.playerList) {
			if (player.nick === String(input)) {
				return player;
			}
		}
		return null;
	}

	setRole(player, role) {
		console.log('[ROLE]', 'Set', player.nick, 'To', role);
		player.setRole(role);
		this.roles[role].addPlayer(player);
		player.chat(utils.getMessageChains('游戏开始！你的角色是 ', this.roles[role].getDisplayName()));
	}

	getTemplate() {
		const playerNumber = this.playerList.length;
		for (let template of config.templates) {
			if (template.length === playerNumber) {
				return template;
			}
		}
		return null;
	}




	isEnd() {
		let flag

		// 如果所有好人都死了
		flag = false;
		for (let player of this.playerList) {
			if (player.role !== 'werewolf' && player.alive) {
				flag = true;
			}
		}
		if (!flag) {
			return true;
		}

		// 如果所有坏人都死了
		flag = false;
		for (let player of this.playerList) {
			if (player.role === 'werewolf' && player.alive) {
				flag = true;
			}
		}
		if (!flag) {
			return true;
		}

		return false;
	}

	async processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';
		await sleep(1000);

		this.chat(`第 ${roundId} 个晚上开始了`);

		// werewolfs' round
		const killedPlayer = await this.roles.werewolf.processNight(roundId);
		await sleep(500);

		// the witch's round
		const { poisonedPlayer, savedPlayer } = await this.roles.witch.processNight(roundId, killedPlayer);
		await sleep(500);

		// the seer's round
		await this.roles.seer.processNight(roundId);
		await sleep(500);

		const diedPlayerList = [];
		if (killedPlayer && (!savedPlayer || savedPlayer.id !== killedPlayer.id)) {
			diedPlayerList.push(killedPlayer);
		}
		if (poisonedPlayer) {
			diedPlayerList.push(poisonedPlayer);
		}
		for (let currentPlayer of diedPlayerList) {
			currentPlayer.alive = false;
		}
		shuffle(diedPlayerList);

		let message = [];
		message.push(`第 ${roundId} 个晚上结束了，`);
		if (diedPlayerList.length === 0) {
			message.push('今天是平安夜');
		} else if (diedPlayerList.length === 1) {
			message.push(['今天晚上 ', At(diedPlayerList[0].id), ' 死了']);
		} else if (diedPlayerList.length === 2) {
			message.push(['今天晚上 ', At(diedPlayerList[0].id), ' 和 ', At(diedPlayerList[1].id), ' 死了']);
		}

		this.chat(utils.getMessageChains(message));

		if (this.isEnd()) {
			this.stop();
		} else {
			await this.processDay(roundId);
		}
	}

	async processDay(roundId) {
		this.roundId = roundId;
		this.roundType = 'day';
		await sleep(1000);

		this.chat(`第 ${roundId} 个白天开始了，请进行投票`);
		let voteResult = await this.voter.next();

		if (!voteResult) {
			await sleep(500);
			this.chat('第一轮投票没有结果，请发言并进行第二轮投票');
			voteResult = await this.voter.next();
		}

		if (voteResult) {
			voteResult.alive = false;
			this.chat(`投票结束，${voteResult.nick} 出局了`);
		} else {
			this.chat('投票结束，没有人出局');
		}

		if (this.isEnd()) {
			this.stop();
		} else {
			await this.processNight(roundId + 1);
		}
	}

	start() {
		if (!this.getTemplate()) {
			this.chat('没有合法的板子，无法开始游戏');
			return;
		}

		shuffle(this.playerList);
		for (let roleName in this.roles) {
			const roleClass = this.roles[roleName];
			roleClass.resetPlayer();
		}
		shuffle(this.playerList);

		for (let i in this.getTemplate()) {
			const player = this.playerList[i];
			const role = this.getTemplate()[i];

			this.setRole(player, role);
		}

		this.started = true;
		this.processNight(1);
	}

	stop() {
		let message = [];
		message.push('游戏结束！\n\n存活玩家：\n');
		for (let player of this.playerList) {
			if (player.alive) {
				message.push(['<', this.roles[player.role].getDisplayName(), '> ', player.nick, ' ', At(player.id), '\n']);
			}
		}
		message.push('死亡玩家：\n');
		for (let player of this.playerList) {
			if (!player.alive) {
				message.push(['<', this.roles[player.role].getDisplayName(), '> ', player.nick, ' ', At(player.id), '\n']);
			}
		}
		message.push('感谢你的游玩');
		this.chat(utils.getMessageChains(message));

		this.started = false;
		this.playerList = [];
	}

	register(id) {
		console.log('[GAME]', 'Register', id);

		if (this.started) {
			this.chat([At(id), Plain(' 游戏已经开始了，无法注册')], id);
			return;
		}

		let registered = false;
		for (let registeredPlayer of this.playerList) {
			if (registeredPlayer.id == id) {
				registered = true;
				break;
			}
		}

		if (!registered) {
			this.addPlayer(new Player(id));
			const currentPlayer = this.getPlayer(id);
			this.chat([At(currentPlayer.id), Plain(` 玩家 ${currentPlayer.getNick()} 注册成功！`)]);
			this.logger.listAllPlayers();
			currentPlayer.chat('hello！我是狼人杀 bot (*^▽^*)\n游玩前建议阅读说明书：https://github.com/memset0/QQbot-The-Werewolves-of-Millers-Hollow，别忘了给个 star 哦');
		} else {
			this.chat([At(id), Plain(' 注册失败，你已经成功报名。')]);
		}
	}

	registerCancel(id) {
		this.log('Register Cancel', id);

		if (this.started) {
			this.chat([At(id), Plain(' 游戏已经开始了，无法取消注册')], id);
			return;
		}

		let registered = false;
		for (let registeredPlayer of this.playerList) {
			if (registeredPlayer.id == id) {
				registered = true;
				break;
			}
		}

		if (registered) {
			this.removePlayer(this.getPlayer(id));
			this.chat([At(id), Plain(' 成功取消注册')]);
			this.logger.listAllPlayers();
		} else {
			this.chat([At(id), Plain(' 取消注册失败，你尚未注册成功。')]);
		}
	}

	constructor(bot) {
		this.bot = bot;
		this.started = false;
		this.playerList = [];

		this.roles = {
			werewolf: new Werewolf(this),
			witch: new Witch(this),
			seer: new Seer(this),
			villager: new Villager(this),
		};
		this.voter = new Voter(this);

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