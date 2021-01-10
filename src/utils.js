const Mirai = require('node-mirai-sdk');
const { Plain } = Mirai.MessageComponent;

module.exports = {
	getMessageChains() {
		const messageChain = [];
		for (let part of arguments) {
			if (typeof (part) === 'string') {
				messageChain.push(Plain(part));
			} else if (part instanceof Array) {
				for (let item of part) {
					messageChain.push(item);
				}
			} else {
				messageChain.push(part);
			}
		}
		return messageChain;
	}
}