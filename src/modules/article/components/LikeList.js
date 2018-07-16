/**
 * 点赞列表
 */
import React, { Component } from 'react';
import { StyleSheet, Message, FlowList, View } from '@components';
import { commonStyle } from '@utils';
import { withUser } from '@modules/user';
import { noCommentImg } from '../assets';
import Author from './Author';

@withUser(false)
export default class LikeList extends Component {
	constructor(...args) {
		super(...args);
		this.setRef = this.setRef.bind(this);
		this.getLikeRequest = this.getLikeRequest.bind(this);
	}
	render() {
		let { artData } = this.props;
		let emptyComp = <Message text={`这篇趣文还没有人点赞`} icon={noCommentImg} />;

		return (
			<FlowList
				{...this.props}
				disabledRefresh={true}
				scrollEnabled={false}
				ItemSeparatorComponent={
					() => <View style={s.separatorStyle}></View>
				}
				request={this.getLikeRequest}
				renderItem={this.renderItem}
				emptyNode={emptyComp}
				onFetchedData={this.onFetchedData}
				ref={this.setRef}
			></FlowList>

		);
	}
	renderItem = ({ item }) => {
		let { artData = {} } = this.props;
		let { author = {} } = artData;
		let { userId, headImg, nickName, createDate } = item;
		return (
			<Author id={userId} avatar={headImg} name={nickName} block style={s.authorWrap} avatarStyle={s.avatarWrap} nameStyle={s.nameWrap} time={createDate} timeStyle={s.timeWrap} />
		);
	}
	getLikeRequest = (pageNo, pageSize) => {
		console.log('this.props.artData.id----LikeList', this.props.artData.id);		
		let listRequest = `/services/app/v1/like/list/${pageNo}/${pageSize}`;
		return {
			url: listRequest,
			params: {
				infoId: this.props.artData.id,
				moduleCode: '1002',
			}
		}
	}

	onFetchedData = (data, res) => {
		this.data = data;
		this.total = res.data.data.count;
		this.props.onTotalUpdate(this.total);
	};

	setRef(element) {
		this.ref = element;
	}

	// used by parent component	
	addItem(data) {
		const user = this.props.user;
		this.data.unshift(data);
		this.ref.updateData(this.data);
		this.total++;
		this.props.onTotalUpdate(this.total);
	}

	componentDidMount() {

	}

	ref = null;
}

const s = StyleSheet.create({
	authorWrap: {
		paddingVertical: commonStyle.transformSize(50),
		paddingHorizontal: commonStyle.transformSize(50),
	},
	avatarWrap: {
		width: commonStyle.transformSize(170),
		height: commonStyle.transformSize(166),
		borderRadius: commonStyle.transformSize(80),
	},
	nameWrap: {
		fontSize: commonStyle.transformSize(52),
		paddingTop: commonStyle.transformSize(18),
	},
	timeWrap: {
		marginTop: commonStyle.transformSize(20),
	},
	separatorStyle: {
		marginLeft: commonStyle.transformSize(50),
		marginRight: commonStyle.transformSize(50),
		height: 0.5,
		backgroundColor: commonStyle.borderColor,
	}
})