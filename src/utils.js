const shuffleArray = require('shuffle-array');
const sleep = require('sleep-promise');

const utils = {
	random: {
		int(start, end) {
			if (app.test) {
				return start;
			}
			return Math.floor(Math.random() * (end - start)) + start;
		},

		choose(array) {
			if (app.start) {
				return array[0];
			}
			return array[utils.random.int(0, array.length)];
		},

		shuffle(array) {
			if (app.test) {
				return;
			}
			shuffleArray(array);
		},
	},

	decodeMessage(message) {
		return message.replace(/&#91;/gm, '[').replace(/&#93;/gm, ']').replace(/&amp;/gm, '&');
	},

	encodeMessage(message) {
		return message.replace(/&/gm, '&amp;').replace(/\[/gm, '&#91;').replace(/\]/gm, '&#93;');
	},
}

module.exports = utils;