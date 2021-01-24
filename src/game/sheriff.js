const assert = require('assert');
const lodash = require('lodash');

const utils = require('./utils');

class Sheriff {

	exists() {
		return !!(this.sheriff && this.sheriff.alive);
	}

	get() {
		return this.exists() ? this.sheriff : null;
	}

	generateSpeechOrder(playerList) {
		const startIndex = utils.random.int(0, playerList.length);
		const order = playerList.slice(startIndex, playerList.length).concat(playerList.slice(0, startIndex));
		return order;
	}

	async runForTheSheriff() {
		await this.game.sendGroup('现在进行警长竞选，上警的玩家请举手');
		const alivePlayerList = this.game.getAlivePlayerList();
		const receivedMessage = await Promise.all(alivePlayerList.map(player => player.waitForReceive(['pass', 'raise'])));
		const registeredPlayerList = lodash.filter(alivePlayerList, (_, index) => receivedMessage[index] === 'raise');
		const unregisteredPlayerList = lodash.filter(alivePlayerList, (_, index) => receivedMessage[index] === 'pass');
		if (!await this.speech.process(this.generateSpeechOrder(registeredPlayerList))) {
			if (this.crashed) {
				await this.game.sendGroup('由于狼队的两连爆，本轮游戏没有警长');
			}
			this.crashed = true;
			return false;
		}
		this.voter.votablePlayers = unregisteredPlayerList.map(player => player.id);
		this.voter.targets = registeredPlayerList.map(player => player.id);
		let voteResult = await this.voter.process();
		if (voteResult.length !== 1) {
			if (!await this.speech.process(this.generateSpeechOrder(voteResult))) {
				if (this.crashed) {
					await this.game.sendGroup('由于狼队的两连爆，本轮游戏没有警长');
				}
				this.crashed = true;
				return false;
			} else {
				voteResult = await this.voter.process();
			}
		}
		if (!voteResult || voteResult.length !== 1) {
			await this.game.sendGroup('由于村民们的意见难以统一，本轮游戏没有警长');
			return true;
		}
		this.sheriff = voteResult[0];
		await this.game.sendGroup(`本轮游戏的警长是 [CQ:at,qq=${this.sheriff.id}]`);
		return true;
	}

	reset() {
		this.sheriff = null;
		this.crashed = false;
	}

	constructor(game) {
		this.game = game;
		this.voter = this.game.voter;
		this.speech = this.game.speech;
		assert(this.game && this.voter && this.speech);

		this.reset();
	}
}

module.exports = Sheriff;