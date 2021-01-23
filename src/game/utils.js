const shuffleArray = require('shuffle-array');
const sleep = require('sleep-promise');

const config = require('../../config');

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

		key() {
			const length = 16;
			const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=';
			let res = '';
			for (let i = 0; i < length; i++){
				res += chars[Math.floor(Math.random() * chars.length)];
			}
			return res;
		}
	},

	decodeMessage(message) {
		return message.replace(/&#91;/gm, '[').replace(/&#93;/gm, ']').replace(/&amp;/gm, '&');
	},

	encodeMessage(message) {
		return message.replace(/&/gm, '&amp;').replace(/\[/gm, '&#91;').replace(/\]/gm, '&#93;');
	},

	timeLimit: {
		message(timeLimit, format = '（时间限制：<1>）') {
			if (isNaN(Number(timeLimit))) {
				timeLimit = config.query('timeLimit.' + timeLimit, -1);
			}
			if (timeLimit == -1) {
				return '';
			} else {
				return format.replace('<1>', timeLimit);
			}
		}
	}
}

module.exports = utils;