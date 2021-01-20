const config = require('../../config');

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

	getPlace() {
		return this.place;
	}

	send(message) {
		console.log('[CHAT]', this.id, message);
		global.bot.sendPrivateMsg(this.id, message);
	}

	receive(message) {

	}

	receiveGroup(message) {

	}

	async waitForReceive(message) {

	}

	async waitForReceiveGroup(message) {

	}

	setRole(role) {
		this.role = role;
	}

	setNick(nick) {
		this.hasNick = true;
		this.nick = nick;
		this.displayName = nick;
	}

	setPlace(place) {
		this.place = parseInt(place);
		if (this.hasNick) {
			this.displayName = `[${place}]${this.nick}`;
		} else {
			this.displayName = `[${place}](no nick)`;
		}
	}

	constructor(id) {
		this.id = id;
		this.alive = true;

		this.nick = `nick<${id}>`;
		this.hasNick = false;
		this.displayName = `${id}`;

		this.role = null;
		this.place = null;

		for (let currentId in config.nicks) {
			if (currentId == id) {
				this.setNick(config.nicks[currentId]);
				break;
			}
		}
	}
}

module.exports = Player;