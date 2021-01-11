const config = require('./config');

const Game = require('./modules/game');

class App {
	async onMessage(message) {
		const { sender, messageChain, reply } = message;
		const messagePlain = messageChain.map(messageChainPart => {
			if (messageChainPart.type === 'Plain') {
				return messageChainPart.text;
			} else if (messageChainPart.type === 'At') {
				return messageChainPart.target;
			} else {
				return '';
			}
		}).join('');
		console.log('[MSG]', messagePlain);

		if (sender.group) { // 群内消息
			if (messagePlain === 'debug') {
				this.game.register(2315374205);
				this.game.register(1405566706);
				// this.game.register(707349985);
				this.game.start();
			} else if (messagePlain === 'register') {
				this.game.register(sender.id);
			} else if (messagePlain === 'register cancel') {
				this.game.registerCancel(sender.id);
			} else if (messagePlain === 'status') {
				this.game.logger.listAllPlayers();
			} else if (messagePlain === 'start game') {
				this.game.start();
			} else if (messagePlain === 'stop game') {
				this.game.stop();
			} else {
				const player = this.game.getPlayer(sender.id);

				if (player) {
					if (messagePlain.startsWith('vote')) {
						const targetPlayer = this.game.getPlayer(messagePlain.slice(5));
						this.game.voter.vote(player, targetPlayer);
					} else if (messagePlain === 'pass') {
						this.game.voter.pass(player);
					}
				}
			}

		} else { // 私聊消息
			if (!this.game.started) {
				reply('游戏未开始');

			} else {
				const player = this.game.getPlayer(sender.id);
				if (player.role) {
					if (player.role === 'werewolf') {
						if (messagePlain.startsWith('# ')) {
							this.game.roles.werewolf.teamChat(player, messagePlain.slice(2));
						} else if (messagePlain.startsWith('chat ')) {
							this.game.roles.werewolf.teamChat(player, messagePlain.slice(5));
						} else if (messagePlain.startsWith('kill ')) {
							const targetPlayer = this.game.getPlayer(messagePlain.slice(5));
							this.game.roles.werewolf.kill(player, targetPlayer);
						} else if (messagePlain === 'pass') {
							this.game.roles.werewolf.pass(player);
						}

					} else if (player.role === 'witch') {
						if (messagePlain.startsWith('poison ')) {
							const targetPlayer = this.game.getPlayer(messagePlain.slice(7));
							this.game.roles.witch.poison(targetPlayer);
						} else if (messagePlain.startsWith('save ')) {
							const targetPlayer = this.game.getPlayer(messagePlain.slice(5));
							this.game.roles.witch.save(targetPlayer);
						} else if (messagePlain === 'pass') {
							this.game.roles.witch.pass();
						}

					} else if (player.role === 'seer') {
						if (messagePlain.startsWith('suspect ')) {
							const targetPlayer = this.game.getPlayer(messagePlain.slice(8));
							this.game.roles.seer.suspect(targetPlayer);
						} else if (messagePlain === 'pass') {
							this.game.roles.seer.pass();
						}
					}
				}
			}
		}
	}

	constructor(bot) {
		this.bot = bot;
		this.game = new Game(bot);

		bot.onMessage(async message => {
			if (message.sender.group && message.sender.group.id !== config.group) {
				// 不在目标群聊中发送的消息
				return;
			}
			if (!message.sender.group && !this.game.getPlayer(message.sender.id)) {
				// 不是游戏中玩家发送的消息
				return;
			}

			await this.onMessage(message);
		});
	}
}

module.exports = App;