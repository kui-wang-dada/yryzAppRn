import * as searchAction from './search.action'
import searchReducer from './search.reducer';
import routes from './routes';
let reducers = { search: searchReducer, }
// 此文件暴露需要被其他模块引用的reducer、routes、Components
export default { searchAction, reducers, routes }