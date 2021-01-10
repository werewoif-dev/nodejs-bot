const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

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

// auth 认证(*)
bot.onSignal('authed', () => {
	console.log(`Authed with session key ${bot.sessionKey}`);
	bot.verify();
});

// session 校验回调
bot.onSignal('verified', async () => {
	console.log(`Verified with session key ${bot.sessionKey}`);

	const friendList = await bot.getFriendList();
	console.log(`There are ${friendList.length} friends in bot`);
});

/* 开始监听消息(*)
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
 * 'temp' - 只监听临时会话
*/
bot.listen('all');

// 退出前向 mirai-http-api 发送释放指令(*)
process.on('exit', () => {
	bot.release();
});