const Mirai = require('node-mirai-sdk');
const { Plain } = Mirai.MessageComponent;

const sleep = require('sleep-promise');

const utils = {
	getFormattedMessageChain() {
		const messageChain = [];
		for (let part of arguments) {
			if (typeof (part) === 'string') {
				messageChain.push(Plain(part));
			} else if (part instanceof Array) {
				for (let item of utils.getFormattedMessageChain(...part)) {
					messageChain.push(item);
				}
			} else {
				messageChain.push(part);
			}
		}
		return messageChain;
	},

	async chatByInterval(chatCaller, messageList, interval = 160) {
		for (let message of messageList) {
			chatCaller(utils.getFormattedMessageChain(message));
			await sleep(interval);
		}
	}
}

module.exports = utils;