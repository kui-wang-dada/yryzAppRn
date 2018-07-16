/**
 * 评论列表
 */
import React, { Component } from 'react';
import {
	http,
} from '@services';
import { View, StyleSheet, Message, FlowList } from '@components';
import { commonStyle } from '@utils';
import { noCommentImg } from '@modules/article/assets';
import { HomeItemHor, HomeItemVer, HomeItemVideo } from '@modules/home';

export default class RelatedRead extends Component {
	constructor(props) {
		super(props);
		this.setRefList = this.setRefList.bind(this);
		this.getRelatedRequest = this.getRelatedRequest.bind(this);

	}
	render() {
		let emptyComp = <Message text={[`没有更多内容了`]} icon={noCommentImg} style={s.noCommentWrap}/>;

		return (
			<FlowList {...this.props}
				ref={this.setRefList}
				disabledRefresh={true}
				scrollEnabled={false}
				ItemSeparatorComponent={
					() => <View style={[s.separatorStyle, this.props.separatorStyle]}></View>
				}
				request={this.getRelatedRequest}
				renderItem={this.renderItem}
				emptyNode={emptyComp}
				onFetchedData={this.onFetchedData}
			></FlowList>

		);
	}
	componentDidMount() {

	}
	setRefCommentList = (r) => {
		this._refRelatedList = r;
	}
	renderItem = ({ item }) => {
		if (item.type === 0) {
			return (
				<HomeItemVer data={item}></HomeItemVer>
			)
		} else if (item.type === 1) {
			return (
				<HomeItemHor data={item}></HomeItemHor>
			)
		} else if (item.type === 2) {
			return (
				<HomeItemVideo data={item}></HomeItemVideo>
			)
		} else {
			return null;
		}
	}
	getRelatedRequest = (pageNo, pageSize) => {
		let listRequest = `/services/app/v1/comment/list/${pageNo}/${pageSize}`;
		return {
			url: listRequest,
			params: {
				infoId: this.props.artData.id,
				moduleCode: '1002',
				order: 0,
			}
		}
	}
}

const s = StyleSheet.create({
	separatorStyle: {
		height: 0.5,
		backgroundColor: commonStyle.borderColor,
		marginLeft: commonStyle.transformSize(190),
	},
	noCommentWrap: {
		height: commonStyle.transformSize(376),
	},
	emptyImageStyle: {
		height: commonStyle.transformSize(158),
	}
})
