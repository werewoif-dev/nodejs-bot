const config = require('./config');

const Game = require('./modules/game');

class App {
	async onMessage(message) {
		const { sender, messageChain, reply } = message;
		const messagePlain = messageChain.map(messageChainPart => {
			if (messageChainPart.type === 'Plain') {
				return messageChainPart.text;
			} else {
				return '';
			}
		}).join('');
		console.log('[MSG]', messagePlain);

		if (sender.group) { // 群内消息
			if (messagePlain === 'debug') {
				this.game.register(2315374205);
				this.game.register(1405566706);
				this.game.start();
			} else if (messagePlain === 'register') {
				this.game.register(sender.id);
			} else if (messagePlain === 'register cancel') {
				this.game.registerCancel(sender.id);
			} else if (messagePlain === 'start game') {
				this.game.start();
			}

		} else { // 私聊消息
			if (!this.game.started) {
				reply('游戏未开始');

			} else {
				const player = this.game.getPlayer(sender.id);
				if (player) {

					if (player.role === 'werewolf') {
						if (messagePlain.startsWith('# ')) {
							this.game.roles.werewolf.teamChat(player, messagePlain.slice(2));
						} else if (messagePlain.startsWith('kill ')) {
							const targetPlayerId = messagePlain.slice(5);
							const targetPlayer = targetPlayerId === 'none' ? new Player(-1) : this.game.getPlayer(targetPlayerId);
							if (targetPlayer) {
								this.game.roles.werewolf.kill(targetPlayer);
							} else {
								reply(`kill 命令格式不正确，你当前的 targetPlayerId 为 ${targetPlayerId}`);
							}
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
				return;
			}
			await this.onMessage(message);
		});
	}
}

module.exports = App;