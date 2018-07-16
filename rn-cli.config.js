
const {createBlacklist} = require('metro');
let config = {
	getBlacklistRE() {
		return createBlacklist([
			// Ignore IntelliJ directories
			/.*\.idea\/.*/,
			// ignore git directories
			/.*\.git\/.*/,
			// Ignore android directories
			/.*\/app\/build\/.*/,
			/.*\/android\/build\/.*/,
			/.*\/android\/.*/,
			/react-native\/local-cli\/core\/__fixtures__.*/,
			/node_modules[/\\]react[/\\]dist[/\\].*/,

			/website\/node_modules\/.*/,

			/heapCapture\/bundle\.js/,

			/.*\/__tests__\/.*/
		
		]);
	}
};
module.exports = config;