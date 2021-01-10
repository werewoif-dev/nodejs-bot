const config = require('../config');

class Player {

	getId() {
		return this.id;
	}

	getNick() {
		return this.nick;
	}

	getRole() {
		return this.role;
	}

	chat(messageChain) {
		console.log('[CHAT]', this.id, messageChain);
		global.bot.sendFriendMessage(messageChain, this.id);
	}

	setRole(role) {
		this.role = role;
	}

	constructor(id) {
		this.id = id;
		this.alive = true;

		if (id === -1) {
			this.nick = '<none>';
		} else {
			for (let currentId in config.nicks) {
				if (currentId == id) {
					this.nick = config.nicks[currentId];
				}
			}
			if (!this.nick) {
				this.nick = `nick<${id}>`;
			}
		}
	}
}

module.exports = Player;