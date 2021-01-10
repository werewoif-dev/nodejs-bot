const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const Role = require('../role');

class Witch extends Role {
	log() {
		console.log('[ROLE]', 'Witch', ...arguments);
	}

	getDisplayName() {
		return [Plain('女巫')];
	}

	poison(targetPlayer) {
		if (!targetPlayer || !targetPlayer.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.chat('posion 命令不合法');
			return;
		}

		this.log('Poison', targetPlayer.nick);

		if (this.poisoned) {
			this.chat('你已经使用过毒药了');
			return;
		}

		if (this.poisonedPlayer) {
			this.chat('你已经决定了要毒的人');
			return;
		}

		this.chat(`你用毒药杀了 ${targetPlayer.nick}`);
		this.poisonedPlayer = targetPlayer;
	}

	save(targetPlayer) {
		if (!targetPlayer || !targetPlayer.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.chat('save 命令不合法');
			return;
		}

		this.log('Save', targetPlayer.nick);

		if (this.saved) {
			this.chat('你已经使用过解药了');
			return;
		}

		if (this.savedPlayer) {
			this.chat('你已经决定了要救的人');
			return;
		}

		if (targetPlayer.id !== this.killedPlayer.id) {
			this.chat('你只能对今晚死亡的人使用解药');
			return;
		}

		this.chat(`你用解药救了 ${targetPlayer.nick}`);
		this.savedPlayer = targetPlayer;
	}

	pass() {
		if (!this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.chat('pass 命令不合法');
			return;
		}

		this.log('Pass');
		this.chat('你结束了你的回合。');

		if (this.poisonedPlayer) {
			this.poisoned = true;
		}
		if (this.savedPlayer) {
			this.saved = true;
		}

		this.nightResolver({
			poisonedPlayer: this.poisonedPlayer,
			savedPlayer: this.savedPlayer,
		});

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	processNight(roundId, killedPlayer) {
		this.roundId = roundId;
		this.roundType = 'night';

		this.poisonedPlayer = null;
		this.killedPlayer = killedPlayer;

		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			if (!this.playerList.length) {
				resolve({
					poisonedPlayer: null,
					savedPlayer: null,
				});
			}

			if (killedPlayer) {
				this.chat(`现在是第 ${roundId} 个晚上！今天晚上 ${killedPlayer.nick} 死了`);
			} else {
				this.chat(`现在是第 ${roundId} 个晚上！没有玩家被狼人杀害`);
			}
		});
	}

	constructor(game) {
		super(game);

		this.saved = false;
		this.poisoned = false;
	}
}

module.exports = Witch;