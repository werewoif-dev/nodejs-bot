class Player {

	getId() {
		return this.id;
	}

	getNick() {
		return this.nick;
	}

	chat(messageChain) {
		this.bot.sendFriendMessage(messageChain, this.id);
	}

	constructor(id, bot) {
		this.id = id;
		this.nick = `nick<${id}>`;
		this.bot = bot;
	}
}

module.exports = Player;