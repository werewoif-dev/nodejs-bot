const Role = require('../role');

class Villager extends Role {
	log() {
		console.log('[ROLE]', 'Villager', ...arguments);
	}

	constructor(game) {
		super(game);
		this.name = '村民';
	}
}

module.exports = Villager;