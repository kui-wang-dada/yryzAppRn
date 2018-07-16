
import ArticleDetail from './ArticleDetail';
import ReplyDetail from './ReplyDetail';
import ArticleTag from './ArticleTag';
import { Author, Like, ArticleBody, CommentItem, CommentList, Follow, Collect } from './components';
import articleReducer from './article.reducer';

let routes = {
	ArticleDetail: {
		screen: ArticleDetail,
		path: 'article/:id'
	},
	ReplyDetail: {
		screen: ReplyDetail,
	},
	ArticleTag: {
		screen: ArticleTag,
	}
};
let reducers = { article: articleReducer }
export default { reducers, routes };
export { reducers, routes, Author, Like, ArticleBody, CommentItem, CommentList, Follow, Collect };