import React, { Component } from 'react';
import { StyleSheet, View } from '@components';
import CommonSearch from './components/CommonSearch';
import { HomeItemHor, HomeItemVer } from '.././home/components'
import { commonStyle as styles } from '@utils';

export default class SearchArticle extends React.PureComponent {

	render() {

		let relatedReq = '/services/app/v1/search/articles';
		let recommendReq = '/services/app/v1/article/list';

		return (
			<CommonSearch
				{...this.props}
				style={{ marginTop: styles.transformSize(-58) }}
				relatedRequest={relatedReq}
				recommendRequest={recommendReq}
				renderItem={this.renderItem}
				ItemSeparatorComponent={() => <View style={style.separatorItemStyle} />} />
		);
	}

	renderItem = ({ item }) => {
		let { coverImgType } = item
		if (coverImgType === 1) {
			return (
				<HomeItemHor
					data={item}
					keyWords={this.props.keyWords}
					goToDetail={() => this.goToDetail(item.id)} />
			)
		} else {
			return (
				<HomeItemVer
					data={item}
					keyWords={this.props.keyWords}
					goToDetail={() => this.goToDetail(item.id)} />
			)
		}
	}

	// 文章详情页跳转
	goToDetail = (id) => {
		this.props.navigation.navigate('ArticleDetail', { id })
	}

}

const style = StyleSheet.create({
	itemSeparator: {
		height: styles.borderWidth,
		marginHorizontal: styles.transformSize(50),
	}
})