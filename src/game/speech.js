const assert = require('assert');

class Speech {

	async process(speechOrder) {
		this.game.logger.push('speech', speechOrder.map(player => player.place).join(','));
		return new Promise(async (resolve, reject) => {
			this.promise = { resolve, reject };
			await this.game.sendGroup(
				'本轮发言顺序：\n' +
				speechOrder.map((player, index) => (String.fromCharCode('a'.charCodeAt(0) + index) + '. ' + player.displayName))
			);
			for (const currentPlayer of speechOrder) {
				this.currentPlayer = currentPlayer;
				await this.game.sendGroup(`请 [CQ:at,qq=${currentPlayer.id}] 发言`);
				await currentPlayer.waitForReceiveGroup(['pass']);
				if (!this.promise) {
					return;
				}
			}
			this.currentPlayer = null;
			this.promise.resolve(true);
		});
	}

	async stop(player) {
		if (!this.promise) {
			return;
		}
		if (this.currentPlayer) {
			this.currentPlayer.cancelWaitGroup();
			this.currentPlayer = null;
		}
		await this.game.sendGroup(`本轮发言中断，直接进入黑夜`);
		this.promise.resolve(false);
	}

	reset() {
		this.promise = null;
		this.currentPlayer = null;
	}

	constructor(game) {
		this.game = game;
		assert(this.game);

		this.reset();
	}
}

module.exports = Speech;