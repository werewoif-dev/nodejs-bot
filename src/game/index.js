const config = require('../../config');

const Game = require('./core');

module.exports = async (app) => {
	await new Promise((resolve) => { app.on('connect', resolve) });
	let bot = app.bots.find(bot => bot);
	let game = new Game(app, bot);
	global.app = app;
	global.bot = bot;
	global.game = game;

	app.on('message', async (session) => {
		const { message, messageType, sender } = session;
		if (messageType === 'private' && !game.getPlayer(session.sender.userId)) {
			return; // 不是游戏中玩家发送的消息
		}
		if (messageType === 'group' && session.groupId !== config.group) {
			return; // 不在目标群聊中发送的消息
		}

		const player = game.getPlayer(sender.userId);
		const targetPlayer = ~message.indexOf(' ') ? game.getPlayer(message.slice(message.indexOf(' ') + 1)) : null;

		console.log('[MSG]', messageType, message, player ? player.nick : player, targetPlayer ? targetPlayer.nick : targetPlayer);

		if (messageType === 'group') { // 群内消息
			if (message === 'debug') {
				await game.register(2601960221);
				await game.register(1405566706);
				// game.register(707349985);
				await game.start();
			} else if (message === 'register') {
				game.register(sender.userId);
			} else if (message === 'unregister') {
				game.unregister(sender.userId);
			} else if (message === 'status') {
				game.status();
			} else if (message === 'start game') {
				game.start();
			} else if (message === 'stop game') {
				game.stop();
			} else {

			}

		} else { // 私聊消息
			if (!game.started) {
				bot.sendPrivateMsg('游戏未开始', sender.userId);
			} else {
				if (player.role) {
					if (message === 'help') {
						game.roles[player.role].help(player);
					} else if (message.startsWith('vote ')) {
						game.voter.vote(player, targetPlayer);
					} else if (message === 'votepass') {
						game.voter.pass(player);
					} else if (player.role === 'werewolf') {
						if (message.startsWith('# ')) {
							game.roles.werewolf.teamChat(player, message.slice(2));
						} else if (message.startsWith('chat ')) {
							game.roles.werewolf.teamChat(player, message.slice(5));
						} else if (message.startsWith('kill ')) {
							game.roles.werewolf.kill(player, targetPlayer);
						} else if (message === 'pass') {
							game.roles.werewolf.pass(player);
						}
					} else if (player.role === 'witch') {
						if (message.startsWith('poison ')) {
							const targetPlayer = game.getPlayer(message.slice(7));
							game.roles.witch.poison(targetPlayer);
						} else if (message.startsWith('save ')) {
							game.roles.witch.save(targetPlayer);
						} else if (message === 'pass') {
							game.roles.witch.pass();
						}
					} else if (player.role === 'seer') {
						if (message.startsWith('suspect ')) {
							const targetPlayer = game.getPlayer(message.slice(8));
							game.roles.seer.suspect(targetPlayer);
						} else if (message === 'pass') {
							game.roles.seer.pass();
						}
					}
				}
			}
		}
	});

};