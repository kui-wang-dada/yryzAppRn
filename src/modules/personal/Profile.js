import React, { Component } from 'react'
import { View, StyleSheet, Text, FlatList, Platform } from 'react-native'
import { Image, Icon, Touchable, Message, FlowList } from '@components'
import { ProfileUserItem } from './components'
import {
	HomeItemHor,
	HomeItemVer,
	HomeItemVideo,
} from '../home/components'
import { transformSize, cache, modal } from '@utils'
import { http } from "@services"
import mockData from './mockData/Profile'
import {
	apiProfile,
	apiArticleWriter,
	apiArticleUser,
	apiFollow
} from './api'

import { connect } from 'react-redux';

let mapStateToProps = (state) => {
	return {
		user: state.user
	};
};
@connect(mapStateToProps)
export default class HomeHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataProfile: null,
			relation: 0
		}
		let { type, id } = this.props.navigation.state.params
		this.postList = null
		this.userType = type  // 0是写手
		this.userId = id
		this.Params = { pageNo: 1, pageSize: 10 }
	}
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title
	})
	componentDidMount() {


		let { user } = this.props
		this.getArticle()

		this.getProfile()


	}
	render() {
		let { dataProfile } = this.state
		let renderItem
		let request = this.getArticle()
		if (this.userType) {
			renderItem = this.renderUser
		} else {
			renderItem = this.renderWriter
		}
		if (dataProfile) {
			return (

				<FlowList
					request={request}
					style={s.flatlist}

					extraData={this.state}
					onFetchedData={this.onFetchedData}
					pageSize={10}
					emptyComponent={this.renderEmpty}
					keyExtractor={this._keyExtractor}
					renderItem={renderItem}
					ListHeaderComponent={this.renderHeader}
					showsVerticalScrollIndicator={false}
					// onEndReached={() => this.handleLoadMore()}
					// onEndReachedThreshold={0.1}
					ref={(ref) => this._refPostList = ref}
				/>
			);
		} else {
			return (<Message preset="no-data"></Message>)
		}

	}
	renderHeader = () => {
		let { headImg, nickName, articleCount, userSign } = this.state.dataProfile
		return (
			<View style={s.headWrap}>
				{/* <View style={s.headTitleWrap}>
					<Touchable onPress={() => { this.props.navigation.goBack() }}>
						<Icon name="arrow-left" size={18} style={{ marginLeft: transformSize(30), color: '#000' }}></Icon>
					</Touchable>
					<Text style={s.headName}>{nickName}
					</Text>
					<View style={{ marginRight: transformSize(60) }}></View>
				</View> */}
				<Image style={s.headAvatar} source={{ uri: headImg }}></Image>
				<Text style={s.headSummary}>{userSign || "这家伙很忙，还没有设置个人简介"}</Text>
				{this.renderFollow()}
				<View style={s.separators}></View>
			</View>
		)
	}
	renderWriter = ({ item, index }) => {
		if (item.videoUrl) {
			return (
				<HomeItemVideo data={item} goToDetail={() => this.goToDetailVideo(item)}></HomeItemVideo>

			)
		} else if (item.coverImgType === 1) {
			return (
				<HomeItemHor data={item} goToDetail={() => this.goToDetail(item.id)}></HomeItemHor>
			)
		} else if (!item.coverImgType) {
			return (
				<HomeItemVer data={item} goToDetail={() => this.goToDetail(item.id)}></HomeItemVer>
			)
		} else {
			return <Message preset="no-data"></Message>
		}
	}
	renderUser = ({ item, index }) => {
		return <ProfileUserItem
			data={item}
			index={index}
			onChangeLike={this.onChangeLike}
			goToSquare={() => this.goToSquare(item.squareKid)}
		/>
	}
	renderFollow = () => {
		let { user } = this.props
		let { relation, dataProfile } = this.state
		let number = this.postList ? this.postList.length : 0
		if (this.userType) {
			return (
				<View style={s.headProWrap}>
					<Text style={s.headProNumber}>{dataProfile.contentCount}</Text>
					<Text style={s.headPro}>作品</Text>
				</View>
			)
		}


		return (
			<View style={s.headBottomWrap}>
				<View style={s.headProWrap_1}>
					<Text style={s.headProNumber}>{dataProfile.contentCount}</Text>
					<Text style={s.headPro}>作品</Text>
				</View>
				{relation ? (
					<Touchable onPress={() => { this.doFollow("delete") }}>
						<View style={s.headProWrap_2}>
							<Icon name="correct" style={[{ color: "#999" }]} size={10}></Icon>
							<Text style={[s.headPro, { color: "#999" }]}>已关注</Text>
						</View>
					</Touchable>
				) : (
						<Touchable onPress={() => { this.doFollow("get") }}>
							<View style={s.headProWrap_2}>
								<Icon name="add" style={{ color: "#543dca" }} size={12}></Icon>
								<Text style={[s.headPro, { color: "#543dca" }]}>关注</Text>
							</View>
						</Touchable>
					)}


			</View>

		)

	}
	renderEmpty = () => {
		return (
			<Message preset="no-data"></Message>
		)
	}

	doFollow = (type) => {
		if (!this.props.user.isSignIn) {
			this.props.navigation.navigate('LoginScreen');
			return
		}
		let { relation, dataProfile } = this.state
		let newRelation
		relation ? newRelation = 0 : newRelation = 1
		this.setState({
			relation: newRelation
		})
		let payload = {
			infoId: this.userId,
			nickName: dataProfile.nickName,
			userSign: dataProfile.userSign,
			headImg: dataProfile.headImg,
			userType: this.userType
		}
		if (type === "get") {
			this.props.dispatch({ type: "addUserAttention", payload })
			this.getFollow("POST")
			return
		}
		if (type === "delete") {
			this.props.dispatch({ type: "deleteUserAttention", payload })
			this.getFollow("DELETE")
			return
		}
	}

	onChangeLike = (likeState, postItemId) => {
		this.postList = this.postList.map((item) => {
			if (item.kid === postItemId) {
				item.likeFlag = likeState ? 1 : 0;
				likeState ? item.likeCount += 1 : item.likeCount -= 1;
			}
			return Object.assign({}, item);
		})
		this._refPostList.updateData(this.postList);
	}

	_keyExtractor = (item, index) => index.toString()


	goToDetail = (id) => {
		this.props.navigation.push('ArticleDetail', { id })
	}
	// 视频详情页跳转
	goToDetailVideo = (item) => {
		let videos = [item]
		let params = {
			videos: videos,
		}
		this.props.navigation.push("VideoDetail", params)

	}
	goToSquare(id) {
		this.props.navigation.push('SquareDetail', { id: id })
	}
	// 数据接口相关
	getProfile = () => {
		let url = `${apiProfile}/${this.userType}/${this.userId}`
		cache(url, res => {
			let data = res.data.data

			this.setState({
				dataProfile: data,
				relation: data.relation
			}, () => {
				this.props.navigation.setParams({ title: this.state.dataProfile.nickName })
			})
		})
	}
	getArticle = () => {
		let { pageNo, pageSize } = this.Params
		let url
		let params = null
		if (this.userType) {
			url = `${apiArticleUser}/${this.userId}`
			return url
		} else {
			url = apiArticleWriter
			params = { writerKid: this.userId }
			return { url: url, params: params }
		}

		// cache({ url, params }, res => {
		// 	let data = res.data.data
		// 	console.log("article", data)
		// 	this.setState({
		// 		dataArticle: data.entities
		// 	})
		// })
	}
	onFetchedData = (data, res) => {
		this.postList = data;
		console.log("this.postList", this.postList)
	}
	getFollow = async (type) => {
		let url = apiFollow
		let method = type
		let data = {
			infoId: this.userId,
			moduleCode: this.userType ? "1006" : "1004"
		}
		await http({ url, method, data })


	}
}

const s = StyleSheet.create({
	flatlist: {
		backgroundColor: "#fff"
		// flex: 1
	},
	// 头部
	headWrap: {
		// height: transformSize(495),
		width: "100%",
		alignItems: 'center',
	},
	headTitleWrap: {
		marginTop: Platform.OS === "ios" ? transformSize(40) : 0,
		height: transformSize(88),
		width: "100%",
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headName: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: transformSize(38)
	},
	headAvatar: {
		marginTop: transformSize(55),
		height: transformSize(144),
		width: transformSize(144),
		borderRadius: transformSize(72),
		overlayColor: '#fff'
	},
	headSummary: {
		marginTop: transformSize(40),
		marginHorizontal: transformSize(40),
		color: "#999",
		fontSize: transformSize(28)
	},
	headBottomWrap: {
		marginTop: transformSize(40),
		marginBottom: transformSize(40),
		width: transformSize(430),
		height: transformSize(66),
		backgroundColor: "#eee",
		flexDirection: "row",
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: transformSize(33)
	},
	headProWrap: {
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: "#eee",
		marginTop: transformSize(40),
		marginBottom: transformSize(40),
		width: transformSize(178),
		height: transformSize(66),
		borderRadius: transformSize(33)
	},
	headProWrap_1: {
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center',
		width: transformSize(215),
		marginLeft: transformSize(10),
		marginVertical: transformSize(13),
		borderRightWidth: transformSize(2),
		borderRightColor: "#ddd",
	},
	headProWrap_2: {
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: transformSize(10),
		width: transformSize(215),

	},
	headProNumber: {
		color: "#543dca",
		fontSize: transformSize(28),
	},
	headPro: {
		color: "#333",
		marginLeft: transformSize(8)
	},
	headFollow: {
		borderRadius: transformSize(6),
		backgroundColor: "#eee",
		textAlign: 'center',
		lineHeight: transformSize(58),
		width: transformSize(178),
		height: transformSize(58),
	},
	separators: {
		width: "100%",
		height: transformSize(10),
		backgroundColor: "#f7f7f7",
	}
})
