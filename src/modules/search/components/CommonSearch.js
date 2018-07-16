import React, { Component } from 'react';
import { View, Text, Panel, FlowList, StyleSheet, Message, FlatList } from '@components';
import { commonStyle as styles } from '@utils';
import { http } from '@services';
export default class CommonSearch extends Component {

	constructor(props) {
		super(props);
		this.state = {
			relatedList: [],
			recommendList: [],
			showRecommend: false,
		};
		this.scrollId = '';
	}

	componentWillReceiveProps(nextProp) {
	}

	render() {
		return (
			<View style={this.props.style}>
				{this.renderRelatedList()}
				{this.state.showRecommend && this.props.recommendRequest && this.renderRecommendList()}
			</View>
		);
	}

	// 匹配到的
	renderRelatedList = () => {

		if (this.state.showRecommend && this.props.recommendRequest) {
			return null;
		}

		return (
			<FlowList
				ref={r => this.flowList = r}
				request={this.getRelatedRequest}
				renderItem={this.props.renderItem}
				numColumns={this.props.numColumns}
				emptyComponent={() => this.renderEmpty()}
				onFetchedData={this.handleFetchedData}
				ItemSeparatorComponent={this.props.ItemSeparatorComponent}
			/>
		);
	}

	renderEmpty = (style) => {
		if (style) {
			return (
				<Message preset="no-search-result" style={style} />
			)
		} else {
			return (
				<Message preset="no-search-result" />
			)
		}
	}

	renderRecommendHeader = () => {
		if (this.state.recommendList.length > 0) {
			return (
				<View>
					{this.renderEmpty(s.noResult)}
					<View style={{ height: styles.transformSize(20), backgroundColor: '#eeeeee' }} />
					<Text style={{
						marginTop: styles.transformSize(60),
						marginLeft: styles.transformSize(40),
						color: '#999999',
						fontSize: styles.transformSize(34),
						fontWeight: 'bold',
						padding: 0,
						includeFontPadding: false,
					}}>猜你喜欢</Text>
				</View>
			);
		} else {
			return null;
		}
	}

	// 推荐的
	renderRecommendList = () => {
		return (
			<FlatList
				data={this.state.recommendList}
				keyboardDismissMode="on-drag"
				ListHeaderComponent={this.renderRecommendHeader()}
				renderItem={this.props.renderItem}
				ItemSeparatorComponent={this.props.ItemSeparatorComponent}
				refreshing={false}
				emptyComponent={() => this.renderEmpty()}
				keyExtractor={(item, index) => index.toString()}
				showsVerticalScrollIndicator={false} />
		);
	}

	getRelatedRequest = (pageNo, pageSize) => {
		let { keyWords, relatedRequest } = this.props;
		console.log('zxw', this.props)
		if (pageNo === 1) {
			this.scrollId = null;
		}
		return {
			url: relatedRequest,
			params: {
				scrollId: this.scrollId,
				keyWord: keyWords,
				pageSize,
			}
		};
	}

	handleFetchedData = (data = [], res) => {
		if (this.props.onFetchedData) {
			this.props.onFetchedData(data, res);
		}
		this.scrollId = res.data && res.data.data && res.data.data.scrollId;
		let recommendRequest = this.props.recommendRequest;
		if (data && data.length > 0) {
			this.setState({
				showRecommend: false,
			});
		} else {
			this.setState({ showRecommend: true }, () => {
				if (recommendRequest)
					http({ url: `${recommendRequest}/1/3`, method: 'get' }).then(res => {
						let { entities: recommendList = [] } = res.data.data
						if (recommendList.length > 0) {
							console.log('zxw', 'setState')
							this.setState({ recommendList })
						}
					}).catch(err => {
						console.log('zxw', err)
					})
			});
		}
	}
}

const s = StyleSheet.create({
	countWrap: {
		...styles.padder,
		paddingTop: styles.transformSize(50),
		paddingBottom: styles.transformSize(16),
		backgroundColor: '#fff',
	},
	countTxt: {
		fontSize: styles.transformSize(44),
		color: '#999',
	},
	noResult: {
		height: styles.transformSize(350)
	}
})
