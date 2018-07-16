// 应用百科类别
import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { View, FlowList, Text, StyleSheet, YModal, Touchable, ImageBackground, Modal, ScrollView, Icon, Toast, findNodeHandle, UIManager, } from '@components';
import {
	commonStyle as styles,
	resizeImage,
	cache,
	umengTrack,

} from '@utils';

import AppItem from './components/AppItem';

export default class Categories extends Component {

	constructor(props) {
		super(props);
		this.state = {
			topCategory: { classifyName: '全部' },
			secondCategory: { classifyName: '全部' },
			thirdCategory: { classifyName: '全部' },
			categories: [],         // 需要遍历的类别
			modalVisible: false,
			category: null,   // 当前所选的类别,用于切换请求
			fadeMask: new Animated.Value(0),
			fadePanel: new Animated.Value(0),
			level: 0
		};
		this.topCategories = [];
		this.secondCategories = [];
		this.thirdCategories = [];
	}

	static navigationOptions = {
		headerTitle: '应用百科',
		headerTitleStyle: { flex: 1, textAlign: 'center' },
		headerRight: <View />
	};

	_renderHeader() {
		let { topCategory, secondCategory, thirdCategory, modalVisible, level } = this.state;
		return (
			<View style={decorate.header}>
				<Touchable onPress={this.openOneLevel.bind(this)}>
					<View style={decorate.categoryItem} ref={(r) => this._topCategories = r}>
						<View style={decorate.categoryMenuBox}>
							<Text style={[decorate.categoryMenu, level === 0 ? decorate.activeMenuColor : null]}
								numberOfLines={1}>{topCategory.classifyName}</Text>
						</View>
						<Icon name={modalVisible && level === 0 ? 'pull-up' : 'pull-down'}
							style={[decorate.menuIcon, level === 0 ? decorate.activeMenuColor : null]} />
					</View>
				</Touchable>
				<View style={decorate.categoryLine}></View>
				<Touchable onPress={this.openSecondLevel.bind(this)}>
					<View style={decorate.categoryItem}>
						<View style={decorate.categoryMenuBox}>
							<Text style={[decorate.categoryMenu, level === 1 ? decorate.activeMenuColor : null]}
								numberOfLines={1}>{secondCategory.classifyName}</Text>
						</View>
						<Icon name={modalVisible && level === 1 ? 'pull-up' : 'pull-down'}
							style={[decorate.menuIcon, level === 1 ? decorate.activeMenuColor : null]} />
					</View>
				</Touchable>
				<View style={decorate.categoryLine}></View>
				<Touchable onPress={this.openThirdLevel.bind(this)}>
					<View style={decorate.categoryItem}>
						<View style={decorate.categoryMenuBox}>
							<Text style={[decorate.categoryMenu, level === 2 ? decorate.activeMenuColor : null]} numberOfLines={1}>{thirdCategory.classifyName}</Text>
						</View>
						<Icon name={modalVisible && level === 2 ? 'pull-up' : 'pull-down'}
							style={[decorate.menuIcon, level === 2 ? decorate.activeMenuColor : null]} />
					</View>
				</Touchable>
			</View>
		);
	}

	_renderPanelInner(categories) {
		return (
			categories.map((cate, index) => {
				return (
					cate.categoryActive
						?
						<ImageBackground source={require('@assets/images/category-btn.png')}
							style={[decorate.categoryBtn, decorate.categoryActive]}
							key={cate.id}>
							<Text style={[decorate.categoryName, decorate.categoryActiveText]}>{cate.classifyName}</Text>
						</ImageBackground>
						:
						<Touchable onPress={this.onSelectCategory.bind(this, cate, index)} key={cate.id}>
							<View style={decorate.categoryBtn}>
								<Text style={decorate.categoryName}>{cate.classifyName}</Text>
							</View>
						</Touchable>
				)
			})
		)
	}



	_renderPanel() {
		let { categories, fadePanel, level } = this.state;
		let empty = categories.length ? false : true;
		return (
			<Animated.View style={[{ opacity: fadePanel }, decorate.bg]}>
				<View style={decorate.directingBox}>
					<View style={decorate.directingItem}>
						{
							level === 0 ?
								<Icon name="pull-down" style={decorate.directingIcon} />
								: null
						}

					</View>
					<View style={decorate.directingItem}>
						{
							level === 1 ?
								<Icon name="pull-down" style={decorate.directingIcon} />
								: null
						}
					</View>
					<View style={decorate.directingItem}>
						{
							level === 2 ?
								<Icon name="pull-down" style={decorate.directingIcon} />
								: null
						}
					</View>
				</View>
				<View style={[empty ? decorate.panelEmpty : decorate.panelInner]}>
					{
						empty ?
							<Text style={decorate.emptyTip}>该分类下无更多分类</Text>
							: this._renderPanelInner(categories)
					}
				</View>
			</Animated.View>

		);
	}


	renderModal() {
		let { modalVisible, fadeMask } = this.state;
		if (!modalVisible) {
			return null;
		}
		return (
			<TouchableWithoutFeedback onPress={this.closeModal.bind(this)}>
				<View style={[decorate.modal]}>
					<Animated.View style={[decorate.mask, { opacity: fadeMask }]}>

					</Animated.View>
					{this._renderPanel()}
				</View>
			</TouchableWithoutFeedback>
		);
	}

	render() {
		let { category } = this.state;
		if (!category) {
			return null;
		}
		let url = `/services/app/v1/application/classify/${category.id}`;
		return (
			<View style={decorate.container}>
				{this._renderHeader()}
				{this.renderModal()}
				<FlowList
					request={url}
					renderItem={({ item }) => <AppItem data={item} />}
				/>
			</View>
		);
	}

	componentDidMount() {
		this.getTopCategories();
	}

	// 进入过渡动画
	fadeEntry() {
		Animated.parallel([
			Animated.timing(this.state.fadeMask, { toValue: 0.5 }).start(),
			Animated.timing(this.state.fadePanel, { toValue: 1 }).start(),
		]);

	}

	// 关闭的过渡动画
	fadeLeave(cb) {
		Animated.parallel([
			Animated.timing(this.state.fadeMask, { toValue: 0 }).start(cb),
			Animated.timing(this.state.fadePanel, { toValue: 0 }).start(),
		]);
	}

	// 获取顶级分类
	getTopCategories() {
		cache('/services/app/v1/classify/top', (res) => {
			this.topCategories = res.data.data;
			if (this.topCategories.length) {
				let topCategory = this.topCategories[0];
				topCategory.categoryActive = true;
				this.setState({
					topCategory,
					category: topCategory
				});
				// 同时把二级分类的数据给添加进去
				this.getSubclassification(topCategory.id);
			}
		});
	}

	// 获取后面的子分类
	getSubclassification(classifyId) {
		let { level } = this.state;
		cache(`/services/app/v1/classify/classify/${classifyId}`, (res) => {
			let data = res.data.data;
			switch (level) {
				case 0:
					this.secondCategories = data;
					this.thirdCategories = [];
					break;
				case 1:
					this.thirdCategories = data;
					break;
			}
		});
	}

	// layout(ref) {
	// 	let handle = findNodeHandle(ref);
	// 	return new Promise((resolve, reject) => {
	// 		UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
	// 			resolve({
	// 				x,
	// 				y,
	// 				width,
	// 				height,
	// 				pageX,
	// 				pageY
	// 			});
	// 		}).catch((err) => {
	// 			reject(err)
	// 		})
	// 	});
	// }


	// 一级分类
	onSelectCategory(cate, index) {
		cate.categoryActive = true;
		let { topCategory, secondCategory, thirdCategory, categories, level } = this.state;
		let state = {
			categories: categories,
			category: cate,
		};
		switch (level) {
			case 0:
				topCategory.categoryActive = false;
				state = {
					...state,
					topCategory: cate,
					secondCategory: { classifyName: '全部' },
					thirdCategory: { classifyName: '全部' }
				};
				break;
			case 1:
				secondCategory.categoryActive = false;
				state = {
					...state,
					secondCategory: cate,
					thirdCategory: { classifyName: '全部' }
				};
				break;
			case 2:
				thirdCategory.categoryActive = false;
				state = {
					...state,
					thirdCategory: cate,
				}
				break;
		}
		this.setState({
			...state,
			modalVisible: false
		}, () => {
			umengTrack('应用_子分类', { '应用分类名': cate.classifyName });
			this.getSubclassification(cate.id);
		});
	}

	openOneLevel(e) {
		this.setState({
			modalVisible: true,
			categories: this.topCategories,
			level: 0
		}, () => {
			this.fadeEntry();
		});
	}

	openSecondLevel(e) {
		this.setState({
			modalVisible: true,
			categories: this.secondCategories,
			level: 1
		}, () => {
			this.fadeEntry();
		});
	}

	openThirdLevel(e) {
		if (!this.state.secondCategory.categoryActive) {
			return Toast.show('您还未选择上级分类哦~');
		}
		this.setState({
			modalVisible: true,
			categories: this.thirdCategories,
			level: 2
		}, () => {
			this.fadeEntry();
		});
	}

	closeModal() {
		this.fadeLeave(() => {
			this.setState({
				modalVisible: false
			});
		});
	}

}

const decorate = StyleSheet.create({
	bg: {
		backgroundColor: 'white'
	},
	activeMenuColor: {
		color: '#543dca'
	},
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	header: {
		paddingHorizontal: styles.transformSize(88),
		height: styles.transformSize(70),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#f4f4f4',
	},
	categoryItem: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	categoryLine: {
		width: styles.transformSize(1),
		height: styles.transformSize(20),
		backgroundColor: '#999'
	},
	categoryMenuBox: {
		maxWidth: styles.transformSize(140)
	},
	categoryMenu: {
		marginRight: styles.transformSize(10),
		textAlign: 'center',
		fontSize: styles.transformSize(28),
		color: '#666'
	},
	panel: {
		paddingHorizontal: styles.transformSize(35),
		paddingTop: styles.transformSize(40),
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	modal: {
		position: 'absolute',
		top: styles.transformSize(70),
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 999
	},
	mask: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
		opacity: 0
	},
	panelInner: {
		paddingLeft: styles.transformSize(40),
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	panelEmpty: {
		height: styles.transformSize(225),
		justifyContent: 'center',
		alignItems: 'center'
	},
	categoryBtn: {
		width: styles.transformSize(154),
		height: styles.transformSize(56),
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: styles.transformSize(5),
		marginBottom: styles.transformSize(40),
		borderRadius: styles.transformSize(10),
		borderWidth: styles.transformSize(1),
		borderColor: '#ddd'
	},
	categoryName: {
		includeFontPadding: false,
		fontSize: styles.transformSize(26),
		color: 'black'
	},
	categoryActive: {
		borderColor: 'transparent'
	},
	categoryActiveText: {
		color: 'white'
	},
	menuIcon: {
		fontSize: styles.transformSize(10),
		color: '#ddd'
	},
	emptyTip: {
		marginTop: styles.transformSize(-38),
		fontSize: styles.transformSize(26),
		color: '#999'
	},
	directingBox: {
		flexDirection: 'row',
		marginBottom: styles.transformSize(25)
	},
	directingItem: {
		flex: 1,
		alignItems: 'center'
	},
	directingIcon: {
		includeFontPadding: false,
		fontSize: styles.transformSize(15),
		color: '#f4f4f4'
	}
}); 
