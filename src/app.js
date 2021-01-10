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
		console.log('[MSG]', message);

		if (sender.group) { // 群内消息
			if (messagePlain === 'register') {
				this.game.register(sender.id);
			} else if (messagePlain === 'register cancel') {
				this.game.registerCancel(sender.id);
			} else if (messagePlain === 'start game') {
				this.game.start();
			}
		} else { // 私聊消息
			if (this.game.started) {
				reply('游戏未开始');
			} else {
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