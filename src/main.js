const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const app  =require('./app');
const config = require('./config');

const bot = new Mirai({
	host: config.host,
	authKey: config.authKey,
	qq: config.qq,
	enableWebsocket: false,
});

// auth 认证(*)
bot.onSignal('authed', () => {
	console.log(`Authed with session key ${bot.sessionKey}`);
	bot.verify();
});
