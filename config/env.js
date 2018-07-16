const baseConfig = require('./env.base.json');
const fs = require('fs');
const path = require('path');
let _ = require('lodash')

function buildEnv() {
	console.log('build configuration loaded from build/env.base.json');
	let config = Object.assign({}, baseConfig);
	let env = process.argv[2] || 'dev'
	console.log(`merge configuration file from build/env.${env}.json`);
	let envConfig = require(`./env.${env}.json`);
	config = _.merge(config, envConfig)
	config.env = env;
	buildPlatform('ios', config)
	buildPlatform('android', config)
	buildPlatform('web', config)
}


function buildPlatform(platform, config) {
	let platformConfig = {};
	platformConfig = traversalNode(config, platform)
	let output = path.join(__dirname, '..', config.output[platform], 'env.json');
	platformConfig = Object.assign({
		"desc": "自动生成的配置文件，不要编辑本文件！！！"
	}, platformConfig)
	fs.writeFileSync(output, JSON.stringify(platformConfig, null, 2), 'utf8');
}

function traversalNode(node, platform) {
	if (typeof node !== 'object')
		return node;
	let {
		ios,
		web,
		android,
		...newNode
	} = node;
	if (node[platform]) {
		if (typeof node[platform] !== 'object') {
			return node[platform]
		}

		Object.assign(newNode, {
			...node[platform]
		})

	}
	for (let key in newNode) {
		newNode[key] = traversalNode(newNode[key], platform)
	}
	return newNode;

}
buildEnv();