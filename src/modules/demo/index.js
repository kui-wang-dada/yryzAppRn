import DemoScreen from './DemoScreen';
import ListView from './ListView'
import PublishScreen from '../publish/PublishScreen'
import FlowListScreen from './FlowListScreen'

import TabViewScreen from './TabViewScreen'
let routes = {
	DemoScreen: {
		screen: DemoScreen,
	},
	ListView: {
		screen: ListView,
	},
	FlowList: {
		screen: FlowListScreen
	},
	TabViewScreen: {
		screen: TabViewScreen
	},
	PublishScreen: {
		screen: PublishScreen,
	},
};
// 此文件暴露需要被其他模块引用的reducer、routes、Components
export default { routes }
