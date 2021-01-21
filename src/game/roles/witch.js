const Role = require('../role');
const config = require('../../../config');

class Witch extends Role {
	poison(player, targetPlayer) {
		if (!player.isAlive() || !targetPlayer || !targetPlayer.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.send('posion 命令不合法');
			return;
		}

		if (this.poisoned) {
			this.send('你已经使用过毒药了');
			return;
		}

		this.send(`你用毒药杀了 ${targetPlayer.displayName} 并结束了你的操作回合`);
		this.log('Poison', targetPlayer.displayName);
		this.poisonedPlayer = targetPlayer;

		this.nightResolver();
		this.endTurn();
	}

	save(player, targetPlayer) {
		if (!player.alive || !targetPlayer || !targetPlayer.alive || !this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.send('save 命令不合法');
			return;
		}

		if (this.saved) {
			this.send('你已经使用过解药了');
			return;
		}

		if (targetPlayer.id !== this.game.roles.werewolf.killedPlayer.id) {
			this.send('你只能对今晚死亡的人使用解药');
			return;
		}

		if (targetPlayer.id === this.playerList[0].id && !(this.rules.saveHerself || (this.rules.saveHerselfAtFirstNight && this.roundId === 1))) {
			this.send('你不能对自己使用解药');
			return;
		}

		this.send(`你用解药救了 ${targetPlayer.displayName} 并结束了你的操作回合`);
		this.log('Save', targetPlayer.displayName);
		this.savedPlayer = targetPlayer;

		this.nightResolver();
		this.endTurn();
	}

	pass(player) {
		if (!this.roundId || this.roundType !== 'night' || !this.nightResolver) {
			this.send('pass 命令不合法');
			return;
		}

		this.log('Pass');
		this.send('你结束了你的操作回合');

		this.nightResolver();
		this.endTurn();
	}

	processNight(roundId) {
		this.roundId = roundId;
		this.roundType = 'night';

		this.savedPlayer = null;
		this.poisonedPlayer = null;

		return new Promise((resolve) => {
			if (!this.isActive()) {
				resolve();
				return;
			}

			this.nightResolver = resolve;
			this.setTimeLimit(config.query('timeLimit.skill.night.witch'), this.nightResolver);

			this.sendGroup('女巫正在决策中...');
			if (!this.saved) {
				if (this.game.roles.werewolf.killedPlayer) {
					this.send(`现在是第 ${roundId} 个晚上！今天晚上 ${this.game.roles.werewolf.killedPlayer.displayName} 死了`);
				} else {
					this.send(`现在是第 ${roundId} 个晚上！没有玩家被狼人杀害`);
				}
			} else {
				this.send(`现在是第 ${roundId} 个晚上`);
			}
		});
	}

	constructor(game) {
		super(game);

		this.name = 'witch';
		this.displayName = '女巫';
		this.commands.concat(['save', 'poison', 'pass']);

		this.saved = false;
		this.poisoned = false;

		this.rules = {
			saveHerself: config.query('rule.witch.saveHerself', false),
			saveHerselfAtFirstNight: config.query('rule.witch.saveHerselfAtFirstNight', false),
		};
		this.log('(rules)', this.rules);

		this.helpMessage = [
			'poison <player>：对 <player> 使用毒药',
			'save <player>: 对 <player> 使用解药',
			'pass：结束当前回合',
			'注意：你的毒药和解药各只有一瓶，且每个操作回合至多使用其中一瓶；当你使用过解药后，你将不会看到每晚的死亡报告',
		];
	}
}

module.exports = Witch;