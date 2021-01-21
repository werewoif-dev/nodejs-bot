const Role = require('../role');

class Villager extends Role {
	constructor(game) {
		super(game);

		this.name = 'villager';
		this.displayName = '村民';
	}
}

module.exports = Villager;