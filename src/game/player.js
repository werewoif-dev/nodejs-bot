const config = require('../../config');

function parseCommand(message) {
	const spaceIndex = message.indexOf(' ');
	return {
		command: message.slice(0, spaceIndex),
		targetPlayer: ~spaceIndex ? game.getPlayer(message.slice(spaceIndex + 1)) : null,
		fit: spaceIndex === -1
	};
}

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
		this.game.bot.sendPrivateMsg(this.id, message);
	}

	receive(message) {
		if (this.promise.private.data.possibleMessages.includes(message)) {
			this.promise.private.resolve(message);
			return;
		}
		const { command, targetPlayer, fit } = parseCommand(message);
		if (this.roleClass.commands.includes(command)) {
			if (fit) {
				this.roleClass[command](this);
			} else {
				this.roleClass[command](this, targetPlayer);
			}
		}
	}

	receiveGroup(message) {
		if (this.promise.group.data.possibleMessages.includes(message)) {
			this.promise.group.resolve(message);
			return;
		}
	}

	async _waitForReceive(type, possibleMessages) {
		return new Promise((resolve, reject) => {
			this.promise[type] = {
				resolve,
				reject,
				data: { possibleMessages },
			};
		});
	}

	async _cancelWait(type) {
		if (this.promise[type]) {
			this.promise[type] = null;
		}
	}

	async waitForReceive(possibleMessages) { return this._waitForReceive('private', possibleMessages); }
	async waitForReceiveGroup(possibleMessages) { return this._waitForReceive('group', possibleMessages); }
	cancelWait() { return this._cancelWait('private'); }
	cancelWaitGroup() { return this._cancelWait('group'); }

	setRole(role) {
		this.role = role;
		this.roleClass = this.game.roles[this.role] || null;
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

	constructor(id, game) {
		this.id = id;
		this.game = game;

		this.alive = true;
		this.op = !!this.game.config.op.includes(this.id);

		this.nick = `nick<${id}>`;
		this.hasNick = false;
		this.displayName = `${id}`;

		this.role = null;
		this.roleClass = null;
		this.place = null;

		for (let currentId in config.nicks) {
			if (currentId == id) {
				this.setNick(config.nicks[currentId]);
				break;
			}
		}

		this.promise = {};
	}
}

module.exports = Player;