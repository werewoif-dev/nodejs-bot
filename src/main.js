const Mirai = require('node-mirai-sdk');

const App = require('./app');
const config = require('./config');

console.log(config.host, config.authKey);

const bot = new Mirai({
	host: config.host,
	authKey: config.authKey,
	qq: config.qq,
	enableWebsocket: false,
});
global.bot = bot;

const app = new App(bot);
global.app = app;

bot.onSignal('authed', () => {
	console.log(`Authed with session key ${bot.sessionKey}`);
	bot.verify();
});

bot.onSignal('verified', async () => {
	console.log(`Verified with session key ${bot.sessionKey}`);

	const friendList = await bot.getFriendList();
	console.log(`There are ${friendList.length} friends in bot`);
});

bot.listen('all');

process.on('exit', () => {
	bot.release();
});