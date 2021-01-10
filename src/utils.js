const Mirai = require('node-mirai-sdk');
const { Plain } = Mirai.MessageComponent;

const utils = {
	getMessageChains() {
		const messageChain = [];
		for (let part of arguments) {
			if (typeof (part) === 'string') {
				messageChain.push(Plain(part));
			} else if (part instanceof Array) {
				for (let item of utils.getMessageChains(...part)) {
					messageChain.push(item);
				}
			} else {
				messageChain.push(part);
			}
		}
		return messageChain;
	}
}

module.exports = utils;