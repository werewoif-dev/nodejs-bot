const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const Role = require('../role');

class Seer extends Role {
	log() {
		console.log('[ROLE]', 'Seer', ...arguments);
	}

	getDisplayName() {
		return [Plain('预言家')];
	}

	chat(message) {
		for (let currentPlayer of this.playerList) {
			currentPlayer.chat(message);
		}
	}

	suspect(targetPlayer) {
		if (!targetPlayer || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.chat('suspect 命令不合法');
			return;
		}

		this.log('Suspect', targetPlayer.nick);

		if (targetPlayer.role === 'werewolf') {
			this.chat(`${targetPlayer.nick} 是坏人`);
		} else {
			this.chat(`${targetPlayer.nick} 是好人`);
		}

		this.nightResolver();

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	pass() {
		if (!this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.chat('pass 命令不合法');
			return;
		}

		this.log('Pass');

		this.nightResolver();

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';

		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			if (!this.playerList.length) {
				resolve();
			}

			this.chat(`现在是第 ${roundId} 个晚上！`);
		});
	}

	constructor(game) {
		super(game);
	}
}

module.exports = Seer;