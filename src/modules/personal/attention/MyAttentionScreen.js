import React from 'react';
import { StyleSheet, ViewPagerAndroid, TouchableOpacity, FlatList } from 'react-native';
import { View, ScrollView, Image, Text, Icon, Platform, Tabs, Dimensions, Toast, Message } from '@components';
import { transformSize, commonStyle } from '@utils';
import Discover from '@modules/discover'
import { http } from '@services'
import * as Action from './attention.action'
import { connect } from 'react-redux';
import store from '../../../store'

const { width } = Dimensions.get('window');

let mapStateTopProps = ({ user, attention }) => {
	let { userList, squareList } = attention
	return { userList, squareList, user }
}

@connect(mapStateTopProps)
export default class MyAttentionScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			showCheck: false,
			pageIndex: 0,
			pageCount: [0, 1],
			userCheckIds: {},
			squareCheckIds: {}
		}
	}

	static navigationOptions = ({ navigation }) => ({
		headerStyle: {
			backgroundColor: '#fff',
			borderBottomWidth: transformSize(1),
			borderBottomColor: "#e5e5e5",
			elevation: 0
		},
		title: "我的关注",
	})

	componentDidMount() {
		this.requestData();
	}

	renderUserItem = ({ item, index }) => {
		let check = this.state.userCheckIds[item.infoId]
		return (
			<TouchableOpacity key={index} style={styles.userItem} onPress={() => this.onUserItem(item, index)}>
				{(this.state.showCheck && this.state.pageIndex === 0) ?
					(<Icon name={check ? 'check-a' : 'check-b'} color={check ? commonStyle.color_theme : '#666'} size={transformSize(35)}
						style={{ marginRight: transformSize(20) }} />) : null}
				<Image style={styles.userImg} source={{ uri: item.headImg }} />
				<View style={styles.userContent}>
					<Text style={styles.userName}>{item.nickName}</Text>
					<Text style={styles.userRemark} numberOfLines={1}>
						{(item.userSign) ? item.userSign : '这家伙很忙,还没有设置个人简介'}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}

	renderSquareItem = ({ item, index }) => {
		let check = this.state.squareCheckIds[item.kid]
		let showCheck = this.state.showCheck && this.state.pageIndex === 1;
		item.kid = item.infoId
		item.joinList = []
		return (
			<TouchableOpacity key={index} style={styles.squareItem} onStartShouldSetResponderCapture={true} onMoveShouldSetResponderCapture={true}
				onPress={() => this.onSquareItem(item, index)}>
				{/* {showCheck ?
					(<Icon name={check ? 'check-a' : 'check-b'} color={check ? commonStyle.color_theme : '#666'} size={transformSize(35)}
						style={{ marginRight: transformSize(20), marginLeft: transformSize(40) }} />) : null} */}
				<Discover.SquareItem data={item} wrapper />
			</TouchableOpacity>
		)
	}

	renderTitle = () => {
		let rightView = null;
		// let showMore = (this.state.pageIndex === 0 && this.props.userList.length > 0) || (this.state.pageIndex === 1 && this.props.squareList.length > 0) ? true : false;
		let showMore = (this.state.pageIndex === 0) || (this.state.pageIndex === 1) ? true : false;
		if (showMore) {
			rightView = (<TouchableOpacity onPress={this.onTitleRight} style={styles.titleRight}>
				<Text style={{ color: "#a8a8a8", textAlign: 'right', fontSize: transformSize(30) }}>
					{this.state.showCheck ? '删除' : '编辑'}
				</Text>
			</TouchableOpacity>)
		}
		return (
			<View style={styles.title}>
				<TouchableOpacity style={styles.titleLeft} onPress={this.onTitleLeft}>
					{
						this.state.showCheck ?
							<Text style={styles.titleCancel}>取消</Text> :
							<Icon name='arrow-back' style={styles.titleBack} />
					}
				</TouchableOpacity>
				<Text style={{ fontSize: transformSize(34), color: '#000' }}>我的关注</Text>
				{rightView}
			</View >
		);
	}

	renderPage = (item, index) => {
		let data = [];
		let renderItem;
		if (index === 0) {
			data = this.props.userList;
			renderItem = this.renderUserItem;
		} else if (index === 1) {
			data = this.props.squareList;
			renderItem = this.renderSquareItem
		}
		return (
			<View style={{ width: width }}>
				{this.renderTitle}
				{data.length === 0 ?
					(<Message preset="no-data" style={styles.empty} />) :
					(<FlatList
						data={data}
						renderItem={renderItem}
						extraData={this.state} />)
				}
			</View>
		)
	}

	renderList = () => {
		let scrollEnabled = this.state.showCheck ? false : true
		let { pageIndex, pageCount } = this.state;
		if (Platform.OS === 'android') {
			return (
				<ViewPagerAndroid
					style={{ flex: 1 }}
					ref={ref => this._viewPage = ref}
					initialPage={pageIndex}
					ket={pageCount.length}
					onPageSelected={this.onPageSelected}
					keyboardShouldPersistTaps="handled"
					scrollEnabled={scrollEnabled}>
					{pageCount.map(this.renderPage)}
				</ViewPagerAndroid>
			)
		} else {
			return (
				<ScrollView
					ref={ref => this._scrollView = ref}
					horizontal={true}
					pagingEnabled={true}
					scrollEventThrottle={16}
					showsHorizontalScrollIndicator={false}
					onMomentumScrollEnd={this.handleScrollEnd}
					scrollEnabled={scrollEnabled}>
					{pageCount.map(this.renderPage)}
				</ScrollView>
			)
		}
	}

	render() {
		let options = ['关注的人', '广场']

		return (
			<View style={styles.container}>
				{/* {this.renderTitle()} */}
				<Tabs
					options={options}
					goToTab={this.goToTab}
					ViewPageIndex={this.state.pageIndex}>
				</Tabs>
				{this.renderList()}
			</View>

		);
	}

	requestData() {
		this.getData(1011)
		this.getData(1008)
	}

	async getData(moduleCode) {
		let params = {
			moduleCode,
			userId: this.props.user.userId
		}
		let type = moduleCode === 1011 ? Action.LOAD_USER : Action.LOAD_SQUARE
		let response = await http.get('/services/app/v1/follow/list/1/10000', { params })//（应用1001，文章1002，写手1004，广场1008，写手和用户1011）
		if (response.data.code === '200') {
			if (response.data.data) {
				let _resData = response.data.data.entities || [];
				console.log(JSON.stringify(_resData))
				this.props.dispatch({ type, payload: _resData })
			}
		}

	}

	goToTab = (index) => {
		if (this.state.showCheck) {
			return
		}
		if (Platform.OS === 'android') {
			this._viewPage.setPage(index);
		} else {
			let x = index * width;
			this._scrollView.scrollTo({ x, y: 0, animated: true });
		}
		this.setState({ pageIndex: index });
	}

	onPageSelected = (e) => {
		let pageIndex = e.nativeEvent.position || 0;
		this.setState({ pageIndex });
	}

	handleScrollEnd = (e) => {
		let offsetX = e.nativeEvent.contentOffset.x;
		let pageIndex = offsetX / width;
		this.setState({ pageIndex });
	}

	onTitleLeft = () => {
		if (this.state.showCheck) {
			this.setState({
				showCheck: false
			});
		} else {
			this.props.navigation.goBack();
		}
	}

	onTitleRight = () => {
		if (this.state.showCheck) {
			if (this.state.pageIndex === 0) {
				let { userCheckIds } = this.state;
				for (let key in userCheckIds) {
					if (userCheckIds[key]) {
						userCheckIds.push({ infoId: key })
					}
				}
				if (userCheckIds.length === 0) {
					Toast.log('请选择要取消关注的用户~')
					return;
				}
				Toast.log('操作成功~')
				this.props.dispatch({ type: Action.DELETE_USER, payload: userCheckIds })
			} else {
				let { squareCheckIds } = this.state;
				for (let key in squareCheckIds) {
					if (squareCheckIds[key]) {
						squareCheckIds.push({ infoId: key })
					}
				}
				if (squareCheckIds.length === 0) {
					Toast.log('请选择要取消关注的广场~')
					return;
				}
				Toast.log('操作成功~')
				this.props.dispatch({ type: Action.DELETE_SQUARE, payload: squareCheckIds })
			}
		} else {
			this.setState({
				showCheck: true
			});
		}
	}

	onUserItem = (item, index) => {
		if (this.state.showCheck) {
			let { userCheckIds } = this.state
			userCheckIds[item.infoId] = !userCheckIds[item.infoId];
			this.setState({ userCheckIds });
		} else {
			this.props.navigation.navigate('Profile', { id: item.infoId, type: item.userType })
		}
	}

	onSquareItem = (item, index) => {
		// if (this.state.showCheck) {
		// 	let { squareCheckIds } = this.state
		// 	squareCheckIds[item.kid] = !squareCheckIds[item.kid];
		// 	this.setState({ squareCheckIds });
		// } else {
		this.props.navigation.navigate('SquareDetail', { id: item.infoId })
		// }
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: transformSize(40),
		backgroundColor: '#FFFFFF',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	empty: {
		flex: 1,
		alignItems: 'center'
	},
	title: {
		width: '100%',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: transformSize(100)
	},
	titleLeft: {
		position: 'absolute',
		left: transformSize(30),
		width: transformSize(150)
	},
	titleCancel: {
		fontSize: transformSize(30),
		color: commonStyle.color_theme,
		textAlign: 'left'
	},
	titleBack: {
		fontSize: transformSize(32),
		color: '#666',
		textAlign: 'left',
		marginLeft: -4
	},
	titleRight: {
		position: 'absolute',
		right: transformSize(30),
		width: transformSize(90)
	},
	loading: {
		flexDirection: 'row',
		height: transformSize(94),
		alignItems: 'center',
		justifyContent: 'center'
	},
	loadingText: {
		fontSize: transformSize(22),
		marginLeft: transformSize(16),
		color: '#666'
	},
	userItem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: transformSize(40),
		paddingVertical: transformSize(30),
	},
	userImg: {
		width: transformSize(200),
		height: transformSize(200),
		borderRadius: transformSize(55),
		overlayColor: '#fff',
	},
	userContent: {
		flex: 1,
		marginLeft: transformSize(20),
		justifyContent: 'center',
	},
	userName: {
		fontSize: transformSize(34),
		marginBottom: transformSize(5),
		color: '#333'
	},
	userRemark: {
		fontSize: transformSize(26),
		marginTop: transformSize(5),
		color: '#999'
	},
	squareItem: {
		// flex: 1,
		// alignItems: 'center',
		marginTop: transformSize(64),
		marginBottom: transformSize(36),
		// flexDirection: 'row'
	}
})