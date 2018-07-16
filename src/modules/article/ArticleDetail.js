import React from 'react';
import {
	View, Text, StyleSheet, ScrollView,
	Tag, TagGroup, FlatList, Touchable,
	ImageBackground, LayoutAnimation, UIManager,
	findNodeHandle, Icon, Image, Platform, Alert, Share
} from '@components';
import {
	ArticleHeader, ArticleBody, AuthorBar, InteractionBar, AppBlock, ArticleItem,
	CommentList
} from './components';
import { DeviceEventEmitter } from 'react-native'
import { http } from '@services';
import { cache, commonStyle, openUrl, modal, env, umengTrack } from '@utils';
import { connect } from 'react-redux';
import { withUser } from '@modules/user';
@connect()
@withUser(false)
class ArticleDetail extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const menuTrigger = (
			<Touchable transparent onPress={navigation.getParam('pressHeaderMore')} style={style.moreMenu}>
				<Icon name="more" size={5} color='#333' />
			</Touchable>
		);
		let data = navigation.getParam('article');
		let showHeaderTop = navigation.getParam('showHeaderTop');
		let headerStyle = {
			borderBottomWidth: StyleSheet.hairlineWidth,
			elevation: 1,
			borderBottomColor: '#e5e5e5',
		};
		let finalConfig = {
			headerTitle: <ArticleHeader data={data} showHeaderTop={showHeaderTop} onFollowed={navigation.getParam('onFollowed')} />,
			headerRight: menuTrigger,
			headerLeft: <Icon name={'arrow-left'} style={style.backButton} onPress={() => { navigation.goBack() }} />,
		};
		finalConfig = showHeaderTop ? { ...finalConfig, ...headerStyle } : finalConfig;
		return finalConfig;
	}
	constructor(props) {
		super(props);
		this.state = {
			article: {},
			scrolledAway: false,
			adData: {},
			showCommentView: false,
			actionTabLayout: {},
			// 显示头部导航栏内容
			showHeaderTop: false,
			commentInView: false,
			shouldShowReviewBubble: false,
		};
		this.setBodyRef = this.setBodyRef.bind(this);
	}
	render() {
		let { article } = this.state;
		if (!article.id) {
			return null;
		}
		return (
			<View style={style.main}>
				{this.renderBody()}
				{this.renderInteractionBar()}
			</View>
		);
	}
	renderBody = () => {
		let { article } = this.state;
		return (
			<View style={style.main}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					onContentSizeChange={this.scrollViewContentSizeChange}
					onLayout={this.scrollViewonLayout}
					scrollEventThrottle={16} onScroll={this.handleScroll}
					ref={r => this._refBody = r}
					stickyHeaderIndices={[4]}
					contentContainerStyle={{
						paddingBottom: Platform.select({
							'ios': commonStyle.transformSize(174),
							'android': commonStyle.transformSize(208)
						})
					}}
				>
					{this.renderArticle(article)}
					{this.renderTags(article)}
					{this.renderRelatedArt(article)}
					{this.renderAd()}
					{this.renderTabs()}
					{this.renderActionList()}
				</ScrollView>

				{this.state.scrolledAway && this.renderFixedApp()}
			</View>
		);
	};
	renderArticle = (article) => {
		return (
			<ArticleBody
				ref={this.setBodyRef}
				id={article.id}
				title={article.title}
				contentSource={article.contentSource}
				beforeContent={this.renderBeforeContent(article)}
				style={style.article}
				onRouteChange={this.onRouteChange}
			/>
		);
	};
	renderTags = (data = {}) => {
		let { labels } = data;
		let { navigation } = this.props;
		labels = labels || [];
		if (labels.length === 0) {
			return <View />;
		}
		let tags = labels.map((item, index) => {
			let { id, labelName } = item;
			return <Tag key={index} style={style.labelTag}
				onPress={() => navigation.navigate('ArticleTag', { tagId: id, tagName: labelName })}>{labelName}</Tag>
		})
		return (
			<View style={style.bottomTag}>
				<TagGroup>{tags}</TagGroup>
				<AppBlock data={data} ref={r => this._refAppName = r} onPayForApp={this.onPayForApp}></AppBlock>
			</View>
		);
	}
	renderBeforeContent = (data = {}) => {
		return <AuthorBar data={data} ref={f => this._refAuthorBar = f} onFollowed={this.onFollowed}></AuthorBar>
	};
	renderRelatedArt = (data) => {
		let { relatedArticles = [] } = data;
		if (relatedArticles.length < 1) {
			return <View />;
		}
		return (
			<View>
				<Text style={style.relatedArtTitle}>相关阅读</Text>
				<FlatList data={relatedArticles}
					keyExtractor={(item, index) => index.toString()}
					style={style.relatedArtView}
					renderItem={({ item }) => <ArticleItem data={item} horizontal onPress={this.pressRelatedArt} />} />
			</View>
		)
	}
	pressRelatedArt = (data) => {
		this.props.navigation.push('ArticleDetail', { id: data.id });
	}
	renderAd = () => {
		let { adData = {} } = this.state;
		let { adDisplay, adTitle, adUrl, id, adPicture } = adData;
		// adData.adPicture = 'http://via.placeholder.com/414x134/f61?text=slider1';
		if (!id) {
			return <View />;
		}
		return (
			<View style={style.adWrap}>
				<Touchable onPress={openUrl({ href: adUrl, type: adDisplay, webTitle: adTitle })}
					style={style.adAnchor}
				>
					<ImageBackground source={{ uri: adPicture }} style={style.adView} >
						<View style={style.adTxtView}><Text style={style.adTxt}>广告</Text></View>
					</ImageBackground>
				</Touchable>
			</View>

		)
	}
	renderTabs = () => {
		let { article = {} } = this.state;
		if (!article.id) { return <View />; }
		return (
			<View ref={r => this._refActionTab = r} collapsable={false} style={style.tabsWrap}>
				<View style={style.tabContainer} >
					<View style={style.commentWrap}>
						<Text style={[style.tabHeaderTxt]}>评论</Text>
						<View style={style.activeTabBottom}></View>
					</View>
					<Text style={style.commentCount}>{article.behavior.commentCount}</Text>
				</View>
			</View>
		)
	}
	renderActionList = () => {
		let data = this.state.article || {};
		if (!data.id) { return <View />; }
		return (
			<View onLayout={this.onLayoutActionTab} style={style.whiteBack}>
				<CommentList
					artData={data}
					onTotalUpdate={this.updateCommentTotal}
					handleReply={this.handleReply}
				/>
			</View>
		)
	};
	renderInteractionBar = () => {
		let data = this.state.article || {};
		let { showCommentView } = this.state;
		return (
			<InteractionBar data={data}
				showCommentView={showCommentView}
				pressComment={this.pressComment}
				onAddComment={this.onAddComment}
				onChangeLike={this.onChangeLike}
				ref={r => this._refActionBar = r}
				changeCollectState={this.changeCollectState}
				onCommentPress={this.onCommentPress}
				user={this.props.user}
			></InteractionBar>
		);
	}

	componentDidMount() {
		let { id } = this.props.navigation.state.params;
		this.loadArticleData(id);
		this.loadAd();
		this.props.navigation.setParams({ pressHeaderMore: this.openMenu, onFollowed: this.onFollowed });
		umengTrack('文章详情', { '文章': `文章${id}` });
	}
	componentWillReceiveProps(nextProps) {
		let { id } = this.props.navigation.state.params;
		if (nextProps.user !== this.props.user) {
			this.loadArticleData(id);
			this.loadAd();
		}
	}
	onAddComment = (newComment) => {
		DeviceEventEmitter.emit('newComment', newComment)
	}
	handleScroll = (e) => {
		let _refAuthorBar = this._refAuthorBar;
		let authorBarHandle = findNodeHandle(_refAuthorBar);
		// returns the size of an element and its position relative to the viewport.
		UIManager.measure(authorBarHandle, (x, y, width, height, px, py) => {
			if (py < commonStyle.transformSize(100) && this.state.showHeaderTop === false) {
				this.setState({ showHeaderTop: true }, () => {
					this.props.navigation.setParams({ showHeaderTop: true });
				});
			} else if (py >= commonStyle.transformSize(100) && this.state.showHeaderTop === true) {
				this.setState({ showHeaderTop: false }, () => {
					this.props.navigation.setParams({ showHeaderTop: false });
				});
			}
		});

		// 显示评论输入框
		let actionTabHandle = findNodeHandle(this._refActionTab);
		UIManager.measure(actionTabHandle, (x, y, width, height, px, py) => {
			if (py < commonStyle.SCREEN_HEIGHT - commonStyle.transformSize(168 * 2)) {
				this.setStateExactly({ showCommentView: true });
			} else {
				this.setStateExactly({ showCommentView: false });
			}
		});
		const scrolledAway = e.nativeEvent.contentOffset.y >= commonStyle.transformSize(400);
		if (scrolledAway !== this.state.scrolledAway) {
			LayoutAnimation.easeInEaseOut();
			this.setState({
				scrolledAway
			});
		}
	};
	setStateExactly = (state, callBack) => {
		const exactState = {};

		for (const name in state) {
			if (state[name] !== this.state[name]) {
				exactState[name] = state[name];
			}
		}

		if (!Object.keys(exactState).length) {
			return;
		}

		this.setState(exactState, callBack);
	};
	onFollowed = (followState) => {
		const article = this.state.article;
		article.author.followFlag = followState ? 1 : 0;
		this.setState({
			article
		}, () => {
			this.props.navigation.setParams({ article });
		});
	};
	handleReply = (rootCommentItem, targetCommentItem) => {
		this._refActionBar.focusCommentInput(rootCommentItem, targetCommentItem);
	}
	updateCommentTotal = (number) => {
		if (number <= 0) {
			number = 0;
		}
		let article = this.state.article;
		article.behavior.commentCount = number;
		this.setState({
			article
		});
	};

	updateLikeTotal = (number) => {
		let article = this.state.article;
		article.behavior.likeCount = number;
		this.setState({
			article
		});
	};
	loadAd = async () => {
		let res = await http({ url: `/services/app/v1/ad/random`, params: { keyWord: '文章详情页' } });
		this.setState({ adData: res.data.data || {} });
	}
	onPayForApp = (data) => {
		let article = this.state.article;
		article.payedFlag = 1;
		Object.assign(article.application, data);
		this.setState({
			article
		});
	};
	setBodyRef = (r) => {
		this._bodyRef = r;
	}
	onRouteChange = (callBack) => {
		// react-navigation lifecycle
		this.routeChange = this.props.navigation.addListener('didBlur', (p) => {
			callBack();
		});
	}
	loadArticleData = (id) => {
		cache(`/services/app/v2/article/${id}?viewFlag="no"`, (res) => {
			let article = res.data.data;
			this.setState({
				article
			}, () => {
				this.props.navigation.setParams({ article: this.state.article });
			});
		});
	}
	onChangeLike = (likeState, itemId) => {
		let { article } = this.state;
		article.behavior.likeFlag = likeState ? 1 : 0;
		likeState ? article.behavior.likeCount += 1 : article.behavior.likeCount -= 1;
		this.setState({ article });
	}
	changeCollectState = (followState) => {
		let id = this.props.navigation.state.params.id;
		let { article } = this.state;
		followState = followState ? 1 : 0;
		article.behavior.favoriteFlag = followState;
		this.setState({ article });
		DeviceEventEmitter.emit('CancelCollection');
	}
	openMenu = () => {
		let { application = {}, title, description, id, coverImgUrl, payFlag, behavior } = this.state.article;
		// if (!payFlag) {
		// 	title = `【${application.appliName}】${title}`;
		// }
		coverImgUrl = coverImgUrl || '';
		let imgUrl = coverImgUrl.split(',') && coverImgUrl.split(',')[0];
		let data = {
			title: `【悠然一指】${title}`,
			content: description,
			url: `${env.webBaseUrl}/article-share/${id}`,
			imgUrl: imgUrl || application.appliIcon,
		}
		let component = (<Share  {...this.props} data={data} report />)
		modal.show(component, 'share');
	}
	menuCallback = (index) => {
		switch (Number(index)) {
			case 0: {
				this._refActionBar.share();
				break;
			}

			case 1: {
				this.props.navigation.navigate('YWebView', {
					url: 'http://youranyizhi.mikecrm.com/jQuV4xR'
				});
				break;
			}

			case 2: {
				this.props.navigation.navigate('YWebView', {
					url: `${env.webBaseUrl}/static/page/disclaimer.html`
				});
				break;
			}
		}
	}
	renderFixedApp = () => {
		let { article } = this.state;
		let { payFlag, payedFlag, application } = article;
		let ableViewApp = !(payFlag && !payedFlag);
		if (Platform.OS === 'ios') {
			return null;
		} else {
			if (!ableViewApp) {
				return (
					<Touchable style={[style.fixedApp, style.textWrap]} onPress={this.viewApp} >
						<Text style={style.text}>付费查看</Text>
					</Touchable>
				);
			}
			return (
				<Touchable type="highlight" onPress={this.goApp(application)} style={style.fixedApp}>
					<Image source={{ uri: application.appliIcon }} placeholder style={style.fixedAppLogo} />
				</Touchable>
			);
		}
	}
	viewApp = () => {
		let { id } = this.state.article;
		Alert.alert(
			'', '是否使用1悠然币查看应用？',
			[
				{ text: '否', onPress: () => console.log('取消'), style: 'cancel' },
				{
					text: '是', onPress: async () => {
						let res = await http({ url: `/services/app/v1/article/pay/${id}`, method: 'post' });
						if (res.data.data.id) {
							this.onPayForApp && this.onPayForApp(res.data.data);
						}
					},
				}
			]
		)
	}
	goApp = (application) => () => {
		this.props.navigation.navigate('AppDetail', { id: application.id });
		umengTrack('应用详情页', { '来源': '文章详情页' });
	}
	onLayoutActionTab = ({ nativeEvent }) => {
		let { layout } = nativeEvent;
		this.setState({ actionTabLayout: layout });
	}
	scrollViewContentSizeChange = (contentWidth, contentHeight) => {
		this.scrollViewContentHeight = contentHeight;
	}
	scrollViewonLayout = ({ nativeEvent }) => {
		this.scrollViewLayout = nativeEvent.layout;
	}
	onCommentPress = () => {
		let { actionTabLayout } = this.state;
		if (this.state.commentInView) {
			this._refBody.scrollTo({ x: 0, y: 0, animated: false });
			this.setState({ commentInView: false });
		} else {
			let scrollY = Math.min(actionTabLayout.y - commonStyle.transformSize(145), Math.abs(this.scrollViewContentHeight - this.scrollViewLayout.height));
			this._refBody.scrollTo({ x: 0, y: scrollY, animated: false });
			this.setState({ commentInView: true });
		}
	}

	componentWillUnmount() {
		this.routeChange && this.routeChange.remove();
	}

}

export default ArticleDetail;


const style = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: '#f8f8f8',
	},
	article: {
		paddingTop: 0,
		paddingBottom: commonStyle.transformSize(46),
	},
	moreMenu: {
		height: commonStyle.commonHeaderHeight,
		width: commonStyle.transformSize(112),
		...commonStyle.centerWrap,
	},
	labelTag: {
		backgroundColor: '#fff',
		color: '#999',
		...commonStyle.border,
	},
	relatedArtTitle: {
		marginTop: commonStyle.transformSize(20),
		paddingTop: commonStyle.transformSize(56),
		paddingLeft: commonStyle.padding,
		fontSize: commonStyle.transformSize(34),
		backgroundColor: '#fff',
		color: '#999',
	},
	relatedArtView: {
		paddingTop: commonStyle.transformSize(32),
		backgroundColor: '#fff',
	},
	adWrap: {
		backgroundColor: '#fff',
		paddingTop: commonStyle.transformSize(80),
	},
	adView: {
		height: commonStyle.transformSize(183),
		justifyContent: 'flex-end',
	},
	adTxtView: {
		width: commonStyle.transformSize(60),
		height: commonStyle.transformSize(32),
		borderRadius: commonStyle.transformSize(8),
		borderWidth: 0.5,
		borderColor: '#fff',
		backgroundColor: 'rgba(0,0,0,0.16)',
		...commonStyle.centerWrap,
		marginLeft: commonStyle.transformSize(20),
		marginBottom: commonStyle.transformSize(20),
	},
	adTxt: {
		color: '#fff',
		fontSize: commonStyle.transformSize(20),
	},
	tabHeaderTxt: {
		color: '#000',
		fontSize: commonStyle.transformSize(36),
		paddingBottom: commonStyle.transformSize(18),
		// textAlignVertical: 'top',
		// includeFontPadding: false,
		fontWeight: 'bold',
	},
	commentCount: {
		fontSize: commonStyle.transformSize(30),
		color: '#666',
		marginLeft: commonStyle.transformSize(28),
		marginTop: Platform.select({
			'android': commonStyle.transformSize(6),
			'ios': 0
		}),
	},
	tabContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		backgroundColor: '#fff',
		paddingLeft: commonStyle.padding,
		paddingTop: commonStyle.transformSize(40),
	},
	commentWrap: {
		// flexDirection: 'column',
		// alignItems: 'center',
	},
	activeTabBottom: {
		width: commonStyle.transformSize(38),
		height: commonStyle.transformSize(7),
		backgroundColor: '#543dca',
		borderRadius: commonStyle.transformSize(4),
		alignSelf: 'center',
	},
	actionTab: {
		width: commonStyle.transformSize(229),
		...commonStyle.centerWrap,
	},
	hide: {
		display: 'none',
	},
	whiteBack: {
		backgroundColor: '#fff',
	},
	bottomTag: {
		backgroundColor: '#fff',
		paddingBottom: commonStyle.transformSize(100),
		paddingHorizontal: commonStyle.padding,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	appName: {
		color: '#7762e1',
		fontSize: commonStyle.transformSize(24),
	},
	iosAppName: {
		paddingBottom: commonStyle.transformSize(50),
	},
	fixedApp: {
		position: 'absolute',
		right: commonStyle.padding,
		bottom: 124,
		borderRadius: commonStyle.transformSize(20),
		elevation: 2,
		shadowOpacity: 0.5,
		overflow: 'hidden',
	},
	fixedAppLogo: {
		width: commonStyle.transformSize(110),
		height: commonStyle.transformSize(110),
		borderWidth: commonStyle.transformSize(2),
		borderColor: '#EEEEEE',
		borderRadius: commonStyle.transformSize(20),
		overlayColor: '#fff',
		backgroundColor: '#fff',
	},
	textWrap: {
		width: commonStyle.transformSize(110),
		height: commonStyle.transformSize(110),
		paddingHorizontal: commonStyle.transformSize(20),
		backgroundColor: '#f8f8f8',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: commonStyle.transformSize(28),
	},
	text: {
		color: '#ff6f6b',
		fontSize: commonStyle.transformSize(32),
	},
	backButton: {
		fontSize: commonStyle.transformSize(36),
		width: 30,
		marginLeft: 12,
		color: '#333',
	},
	tabsWrap: {
		marginTop: commonStyle.transformSize(20)
	},
});