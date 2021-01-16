const Role = require('../role');

class Seer extends Role {
	log() {
		console.log('[ROLE]', 'Seer', ...arguments);
	}

	chat(message) {
		for (let currentPlayer of this.playerList) {
			currentPlayer.send(message);
		}
	}

	suspect(targetPlayer) {
		if (!this.isAlive() || !targetPlayer || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.send('suspect 命令不合法');
			return;
		}

		this.log('Suspect', targetPlayer.displayName);

		if (targetPlayer.role === 'werewolf') {
			this.send(`${targetPlayer.displayName} 是坏人`);
		} else {
			this.send(`${targetPlayer.displayName} 是好人`);
		}

		this.nightResolver();

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	pass() {
		if (!this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.send('pass 命令不合法');
			return;
		}

		this.log('Pass');
		this.send('你结束了你的回合');

		this.nightResolver();

		this.roundId = null;
		this.roundType = null;
		this.nightResolver = undefined;
		this.nightRejecter = undefined;
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';
		
		this.sendGroup('预言家正在决策中...');

		return new Promise((resolve, reject) => {
			this.nightResolver = resolve;
			this.nightRejecter = reject;

			if (!this.playerList.length) {
				resolve();
			}

			this.send(`现在是第 ${roundId} 个晚上`);
		});
	}

	constructor(game) {
		super(game);

		this.name = '预言家';

		this.helpMessage =[
			'suspect <player>：查验 <player> 是好人还是坏人',
			'pass：跳过查验',
			'注意：使用 suspect 或 pass 命令后，查验回合立即结束；无论是否存活，都需要用 pass 命令你的操作回合',
		];
	}
}

module.exports = Seer;