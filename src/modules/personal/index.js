import routes from './routes';
import { reducers as messageReducers } from './message';
import { reducers as attentionReducers } from './attention';
let reducers = { ...messageReducers, ...attentionReducers };

export default { routes, reducers }