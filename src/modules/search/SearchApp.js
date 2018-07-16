import React, { Component } from 'react';
import { StyleSheet, View } from '@components';
import CommonSearch from './components/CommonSearch';
import AppItem from '.././app/components/AppItem'
import { commonStyle as styles } from '@utils';

export default class SearchApp extends React.PureComponent {

	render() {

		let relatedReq = '/services/app/v1/search/apps';
		return (
			<CommonSearch
				{...this.props}
				style={{ marginTop: styles.transformSize(-40) }}
				relatedRequest={relatedReq}
				renderItem={this.renderItem}
				ItemSeparatorComponent={() => <View style={style.separatorItemStyle} />} />
		);
	}

	renderItem = ({ item }) => {
		return (
			<AppItem data={item}
				key={item.id}
				keyWords={this.props.keyWords}
				contentOfLines={3} />
		);
	}

}

const style = StyleSheet.create({
	itemSeparator: {
		height: styles.borderWidth,
		marginHorizontal: styles.transformSize(50),
	}
})