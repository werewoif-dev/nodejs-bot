const Mirai = require('node-mirai-sdk');
const { Plain } = Mirai.MessageComponent;

module.exports = {
	getMessageChains() {
		const messageChain = [];
		for (let part of arguments) {
			if (typeof (part) === 'string') {
				messageChain.push(Plain(part));
			} else {
				messageChain.push(part);
			}
		}
		return messageChain;
	}
}