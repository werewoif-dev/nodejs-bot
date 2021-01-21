const colors = require('colors/safe');

const config = require('../../config');

function parseCommand(message) {
	const spaceIndex = message.indexOf(' ');
	return {
		command: ~spaceIndex ? message.slice(0, spaceIndex) : message,
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
		console.log(colors.cyan('[SEND P]'), this.id, message.slice(0, 40).replace(/\n/g, colors.grey('\\n')), message.length > 40 ? colors.grey('...') : '');
		this.game.bot.sendPrivateMsg(this.id, message);
	}

	receive(message) {
		console.log(colors.magenta('[RECEIVE P]'), this.displayName, message);
		if (this.promise.private && this.promise.private.data.possibleMessages.includes(message)) {
			return this.promise.private.resolve(message);
		}
		const { command, targetPlayer, fit } = parseCommand(message);
		if (this.game.voter.promise) {
			if (command === 'vote' && targetPlayer) {
				return this.game.voter.vote(this, targetPlayer);
			} else if (command === 'pass' && fit) {
				return this.game.voter.pass(this);
			}
		}
		if (this.role && this.roleClass.commands.includes(command)) {
			if (fit) {
				return this.roleClass[command](this);
			} else {
				return this.roleClass[command](this, targetPlayer);
			}
		}
		if (this.roleClass.isWolf() && message.startsWith('# ')) {
			return this.roleClass.chat(this, message.slice(2));
		}
	}

	receiveGroup(message) {
		if (this.promise.group && this.promise.group.data.possibleMessages.includes(message)) {
			return this.promise.group.resolve(message);
		}
		console.log(colors.magenta('[RECEIVE G]'), this.displayName, message);
		if (message === 'status') {
			return this.game.status();
		}
		if (message === 'start game') {
			return this.game.start();
		}
		if (message === 'stop game') {
			return this.game.stop();
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
		this.op = !!(this.game.config.op.includes(this.id));

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