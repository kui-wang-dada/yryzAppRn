import React, { Component } from 'react';
import { StyleSheet, FlowList, Message, View } from '@components';
import CommonSearch from './components/CommonSearch';
import VideoItem from '.././home/components/VideoItem'
import { commonStyle as styles, umengTrack } from '@utils';

export default class SearchVideo extends React.PureComponent {

	onFetchedData = (data, res) => {
		this.data = data
		console.log('video', res);
	}

	render() {

		let relatedReq = '/services/app/v1/search/videos';

		return (
			<CommonSearch
				{...this.props}
				ref={r => this.commonSearch = r}
				relatedRequest={relatedReq}
				renderItem={this.renderItem}
				onFetchedData={this.onFetchedData}
				numColumns={2}
				ItemSeparatorComponent={() => <View style={style.separatorItemStyle} />} />
		);
	}

	// 渲染视频页面
	renderItem = ({ item, index }) => {
		return (
			<VideoItem
				data={item}
				index={index}
				goToDetail={() => this.goToDetailVideo(item.id, index)}
				goToProfile={() => this.goToProfile(item.author)}
			/>
		)
	}

	// 视频详情页跳转
	goToDetailVideo = (id, index) => {
		let videos = this.data
		let params = {
			currentIndex: index,
			videos: videos,
			loadMoreData: this.commonSearch.flowList.handleLoadMore,
		}
		this.props.navigation.navigate("VideoDetail", params)
		this.data[index].viewCount += 1
		this.commonSearch.flowList.updateData(this.data)
		umengTrack('视频详情', { '来源': '搜索_视频列表' })
	}
	// 进入个人详情页
	goToProfile = (author) => {
		let type
		let id
		if (author) {
			type = author.type || 1
			id = author.id
		} else {
			type = 1
			id = 1
		}
		console.log(author)
		this.props.navigation.navigate("Profile", { type, id });
	}

}

const style = StyleSheet.create({
	itemSeparator: {
		height: styles.borderWidth,
	}
})