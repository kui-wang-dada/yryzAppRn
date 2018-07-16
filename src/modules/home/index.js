import homeReducer from './home.reducer';
import routes from './routes';
export { HomeItemHor, HomeItemVer, HomeItemVideo, VideoItem } from './components';
let reducers = { home: homeReducer, }
// 此文件暴露需要被其他模块引用的reducer、routes、Components
export default { reducers, routes }
