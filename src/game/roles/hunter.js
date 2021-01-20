const Role = require('../role');
const config = require('../../../config');

class Hunter extends Role {
	log() {
		console.log('[ROLE]', 'Hunter', ...arguments);
	}

	shoot(targetPlayer) {
		if (!targetPlayer || !targetPlayer.alive || !this.killedResolver) {
			this.send('shoot 命令不合法');
			return;
		}

		this.log('Shoot ', targetPlayer.displayName);

		this.shotPlayer = targetPlayer;

		const player = this.playerList[0];
		this.sendGroup(`${player.displayName} 翻枪带走了 ${targetPlayer.displayName}`);

		this.killedResolver();
		this.endTurn();
	}

	pass() {
		if (!this.killedResolver) {
			this.send('shoot 命令不合法');
			return;
		}

		this.log('Shoot ', targetPlayer.displayName);

		this.killedResolver();
		this.endTurn();
	}

	processKilled(roundId, roundType) {
		this.roundId = roundId;
		this.roundType = roundType;

		this.shotPlayer = null;

		return new Promise((resolve) => {
			if (!this.isActive()) {
				resolve();
				return;
			}

			this.killedResolver = resolve;
			this.setTimeLimit(config.query('timeLimit.skill.killed.hunter'), this.killedResolver);

			this.sendGroup(`${this.playerList[0].displayName} 出局，可以发动技能`);
			this.send(`你可以发动技能带走一个玩家`);
		});
	}

	constructor(game) {
		super(game);

		this.name = '猎人';
		this.commands = ['shoot'];

		this.helpMessage = [
			'shoot <player>：开枪带走 <player>',
			'注意：你的技能只能在出局时使用，且如果被女巫毒死时不能发动技能',
		];
	}
}

module.exports = Hunter;