const config = require('../config');

const { App } = require('koishi');
require('koishi-adapter-cqhttp')
const app = new App(config.server.type === 'http' ? {
	type: 'cqhttp:http',
	selfId: config.qq,
	port: config.server.http.port,
	secret: config.server.http.secret,
	token: config.server.http.token,
} : config.server.type === 'ws' ? {
	type: 'cqhttp:ws',
	selfId: config.qq,
	token: config.server.ws.token,
	server: config.server.ws.server,
} : {});

app.command('help').dispose()
app.plugin(require('./game/index'));

(async function () {
	let retryCount = 0;
	while (retryCount++ <= config.retry.max || config.retry.max === -1) {
		try {
			const bot = app.bots.find(bot => bot);
			await app.start();
			await bot.sendPrivateMsg(config.master, '您的 bot 已启动~');
		} catch (err) {
			await bot.sendPrivateMsg(config.master, '您的 bot 遇到未知问题：' + err.message);
			await bot.sendPrivateMsg(config.master, err.stack);
		}
	}
})();