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
			if (player.place === parseInt(input)) {
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
		player.chat(utils.getFormattedMessageChain('游戏开始！你的角色是 ', this.roles[role].getDisplayName()));
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




	checkWinCondition() {

		if (config.condition === 'all') {
			let flag
			let counter

			// 如果所有好人都死了
			flag = false;
			for (let player of this.playerList) {
				if (player.role !== 'werewolf' && player.alive) {
					flag = true;
				}
			}
			if (!flag) {
				return {
					res: true,
					winner: '狼人',
					message: '所有好人已经出局',
				};
			}

			// 如果所有狼人都死了
			flag = false;
			for (let player of this.playerList) {
				if (player.role === 'werewolf' && player.alive) {
					flag = true;
				}
			}
			if (!flag) {
				return {
					res: true,
					winner: '好人',
					message: '所有狼人已经出局'
				};
			}

			// 如果狼人的数量大于等于好人的数量
			counter = 0;
			for (let player of this.playerList) {
				if (player.alive) {
					if (player.role === 'werewolf') {
						counter++;
					} else {
						counter--;
					}
				}
			}
			if (counter >= 0) {
				return {
					res: true,
					winner: '狼人',
					message: '未出局的好人数量小于等于狼人数量'
				};
			}

		} else if (config.condition === 'part') {
			let flag_1
			let flag_2

			// 如果这局有村民且所有村民都死了
			flag_1 = false;
			flag_2 = false;
			for (let player of this.playerList) {
				if (player.role === 'villager') {
					flag_1 = true;
					if (player.alive) {
						flag_2 = true;
					}
				}
			}
			if (flag_1 && !flag_2) {
				return {
					res: true,
					winner: '狼人',
					message: '所有村民已经出局'
				};
			}

			// 如果这局有神且所有神都死了
			flag_1 = false;
			flag_2 = false;
			for (let player of this.playerList) {
				if (player.role !== 'werewolf' && player.role !== 'villager') {
					flag_1 = true;
					if (player.alive) {
						flag_2 = true;
					}
				}
			}
			if (flag_1 && !flag_2) {
				return {
					res: true,
					winner: '狼人',
					message: '所有神已经出局'
				};
			}

			// 如果所有狼人都死了
			flag_2 = false;
			for (let player of this.playerList) {
				if (player.role === 'werewolf' && player.alive) {
					flag_2 = true;
				}
			}
			if (!flag_2) {
				return {
					res: true,
					winner: '好人',
					message: '所有狼人已经出局'
				};
			}


		} else {
			return {
				res: false,
				winner: null,
				error: '没有合法的获胜条件',
			}
		}
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

		this.chat(utils.getFormattedMessageChain(message));

		if (this.checkWinCondition().res) {
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

		if (this.checkWinCondition().res) {
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

		for (let roleName in this.roles) {
			const roleClass = this.roles[roleName];
			roleClass.resetPlayer();
		}

		let roleList = this.getTemplate();
		shuffle(roleList);

		for (let i in roleList) {
			const player = this.playerList[i];
			const role = roleList[i];

			player.setPlace(i + 1);
			this.setRole(player, role);
		}

		this.started = true;
		this.processNight(1);
	}

	stop(result = null) {
		if (!result) {
			result = this.checkWinCondition();
		}

		let message = [];
		message.push(`游戏结束！\n因为 ${result.message}，${result.winner}获得胜利\n存活玩家：\n`);
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
		this.chat(utils.getFormattedMessageChain(message));

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
				let message = [];
				if (this.playerList.length) {
					message.push(`已经注册的玩家有 ${this.playerList.length} 个：\n`);
					for (let i in this.playerList) {
						const player = this.playerList[i];
						message.push([`${i + 1}. ${player.nick}(`, At(player.id), ')']);
						if (this.started) {
							message.push(` [${player.alive ? '存活' : '出局'}]`);
						}
						message.push('\n');
					}
				} else {
					message.push('当前没有玩家注册');
				}
				this.chat(utils.getFormattedMessageChain(message));
			},

			listVotes: (voteResult, countResult) => {
				let message = [];
				message.push('本轮票型为');
				for (let player of this.playerList) {
					const targetPlayer = voteResult[player.id];
					message.push([player.nick, ' → ', targetPlayer.nick]);
					message.push('\n');
				}

				message.push('\n本轮票数统计');
				for (let playerId in countResult) {
					const player = this.getPlayer(playerId);
					message.push([player.nick, ` 获得 ${countResult[playerId].length} 票，来自：`]);
					for (let index in countResult[playerId]) {
						message.push(countResult[playerId][index].nick);
						if (index + 1 !== countResult[playerId].length) {
							message.push('，');
						}
					}
				}

				this.chat(utils.getFormattedMessageChain(message));
			},
		}
	}
}

module.exports = Game;