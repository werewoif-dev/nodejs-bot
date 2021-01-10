const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

const Role = require('../role');

class Villager extends Role {
	log() {
		console.log('[ROLE]', 'Villager', ...arguments);
	}

	getDisplayName() {
		return [Plain('村民')];
	}

	constructor(game) {
		super(game);
	}
}

module.exports = Villager;