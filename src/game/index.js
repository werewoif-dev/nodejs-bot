const colors = require('colors/safe');

const config = require('../../config');

const Game = require('./core');

module.exports = async (app) => {
	if (!app.test) {
		await new Promise((resolve) => { app.on('connect', resolve) });
	}
	let bot = app.bots.find(bot => bot);
	let game = new Game(app, bot);
	global.app = app;
	global.bot = bot;
	global.game = game;
	app.game = game;

	if (app.test) {
		bot.sendGroupMsg = (message) => { };
		bot.sendPrivateMsg = (message) => { };
	}

	app.on('message', async (session) => {
		const { message, messageType, sender } = session;

		if (messageType === 'private' && !game.getPlayer(session.sender.userId)) {
			return; // 不是游戏中玩家发送的消息
		}
		if (messageType === 'group' && session.groupId !== config.group) {
			return; // 不在目标群聊中发送的消息
		}

		const player = game.getPlayer(sender.userId);

		if (messageType === 'group' && !player) {
			if (message === 'register') {
				game.register(sender.userId);
				return;
			} else if (message === 'unregister') {
				game.unregister(sender.userId);
				return;
			}
		}

		if (messageType === 'private' && player) {
			player.receive(message);
			return;
		}

		if (messageType === 'group' && player) {
			player.receiveGroup(message);
			return;
		}
	});

};