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
		global.bot.sendFriendMessage(messageChain, this.id);
	}

	setRole(role) {
		this.role = role;
	}

	constructor(id) {
		this.id = id;
		this.nick = `nick<${id}>`;
	}
}

module.exports = Player;