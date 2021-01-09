const config = require('./config');

const Game = require('./modules/game');

class App {
	mixinBot() {
		this.bot = bot;
	}

	onMessage(message) {
		const { sender, messageChain, reply, quoteReply } = message;
		const messagePlain = messageChain.map(messageChainPart => {
			if (messageChainPart.type === 'Plain') {
				return messageChainPart.text;
			} else {
				return '';
			}
		}).join('');
		if (sender.group) { // 群内消息
			if (messagePlain === 'register') {
				this.game.register(sender.id, quoteReply);
			} else if (messagePlain === 'register cancel') {
				this.game.registerCancel(sender.id, quoteReply);
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

	constructor() {
		this.bot = {};
		this.game = new Game(this.bot);
	}
}



if (!global._app) {
	global._app = app = new App()
}

module.exports = global._app;