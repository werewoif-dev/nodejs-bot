const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

class Voter {

	isEnd() {
		let resultNumber = this.result.length;
		let alivePlayerNumber = 0;
		for (let player of this.game.playerList) {
			if (player.alive) {
				alivePlayerNumber += 1;
			}
		}

		if (alivePlayerNumber === resultNumber) {
			return true;
		} else {
			return false;
		}
	}

	vote(player, targetPlayer) {
		if (!this.resolver || !this.rejecter) {
			this.game.chat([At(player.id), Plain(' 投票未开始')]);
			return;
		}
		if (!player.alive) {
			this.game.chat([At(player.id), Plain(' 你没有投票权限')]);
			return;
		}
		if (!targetPlayer || !targetPlayer.alive) {
			this.game.chat([At(player.id), Plain(' 投票不合法')]);
			return;
		}

		if (Object.keys(this.result).includes(player.id)) {
			this.game.chat([At(player.id), Plain(' 你已经投票 / 弃权过了')]);
		}

		this.result[player.id] = targetPlayer;
		if (this.isEnd()) {
			this.end();
		}
	}

	pass(player) {
		if (!this.resolver || !this.rejecter) {
			this.game.chat([At(player.id), Plain(' 投票未开始')]);
			return;
		}
		if (!player.alive) {
			this.game.chat([At(player.id), Plain(' 你没有投票权限')]);
			return;
		}

		this.result[player.id] = null;
		if (this.isEnd()) {
			this.end();
		}
	}

	next() {
		if (this.resolver || this.rejecter) {
			console.error('ERROR! A vote is already started!');
		}

		this.started = true;
		return new Promise((resolve, reject) => {
			this.resolver = resolve;
			this.rejecter = reject;
		});
	}

	end() {
		let voteCounter = {};
		for (let targetPlayer of this.result) {
			if (targetPlayer) {
				voteCounter[targetPlayer.id] += 1;
			}
		}

		let response = null;
		let maxVoteNumber = -1;
		for (let targetPlayerId of voteCounter) {
			let voteNumber = voteCounter[targetPlayerId];
			if (voteNumber > maxVoteNumber) {
				maxVoteNumber = voteNumber;
				response = this.game.getPlayer(targetPlayerId);
			}
		}

		this.started = false;
		this.resolver(response);
		this.resolver = undefined;
		this.rejecter = undefined;
	}

	constructor(game) {
		this.game = game;
		this.started = false;
	}
}

module.exports = Voter;