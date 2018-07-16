import * as discoverAction from './discover.action';
import discoverReducer from './discover.reducer';
import routes from './routes';
import SquareItem from './components/SquareItem';
import AppItem from './components/PopularAppItem';
let reducers = { discover: discoverReducer, }
// 此文件暴露需要被其他模块引用的reducer、routes、Components
export default { discoverAction, reducers, routes, SquareItem, AppItem }
export { DiscussItem } from './components';
