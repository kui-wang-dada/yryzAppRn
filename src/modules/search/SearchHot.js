import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Tag, TagGroup, Panel } from '@components';
import { commonStyle as styles, cache } from '@utils';
import SearchTag from './components/SearchTag';
import SearchBar from './components/SearchBar';
// import { YZhugeIo } from 'ydk-react-native';
// import { cache } from '@utils';

export default class SearchScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hotWordsArr: [],
			hotLabelArr: [],
		};
	}

	render() {
		return (
			<ScrollView keyboardDismissMode='on-drag' >
				{this.renderHotSearch()}
				{(this.state.hotLabelArr.length > 0) ? <View style={searchStyle.divider} /> : null}
				{this.renderHotLabel()}
			</ScrollView>
		);
	}

	componentDidMount() {
		this.fetchHotWords();
	}

	fetchHotWords = () => {
		// let res = await Promise.all(
		// 	[
		// 		http('/services/app/v1/hotword/list'),
		// 		http('/services/app/v1/label/hotLabel')
		// 	]);
		// let hotWordsArr = res[0].data.data;
		// let hotLabelArr = res[1].data.data;
		cache('/services/app/v1/hotword/list', (res) => {
			let hotWordsArr = res.data.data;
			this.setState({ hotWordsArr });
		});
		cache('/services/app/v1/label/hot', (res) => {
			let hotLabelArr = res.data.data || [];
			this.setState({ hotLabelArr });
		});
		// let hotWordsArr = [
		// 	{ hotword: '萨克洛夫就开始放假啊' },
		// 	{ hotword: '时间范德萨JFK达拉斯' },
		// 	{ hotword: '圣诞节反抗拉萨就阀打开拉萨' },
		// 	{ hotword: '撒娇阀打开拉萨JFK拉萨三点' },
		// 	{ hotword: '113是东方大厦开了房间萨拉' },
		// 	{ hotword: '时间范德萨JFK达拉斯' },
		// 	{ hotword: '圣诞节反抗拉萨就阀打开拉萨' },
		// 	{ hotword: '撒娇阀打开拉萨JFK拉萨三点' },
		// 	{ hotword: '113是东方大厦开了房间萨拉' },
		// 	{ hotword: '时间范德萨JFK达拉斯' },
		// 	{ hotword: '圣诞节反抗拉萨就阀打开拉萨' },
		// 	{ hotword: '撒娇阀打开拉萨JFK拉萨三点' },
		// 	{ hotword: '113是东方大厦开了房间萨拉' },
		// 	{ hotword: '时间范德萨JFK达拉斯' },
		// 	{ hotword: '圣诞节反抗拉萨就阀打开拉萨' },
		// 	{ hotword: '撒娇阀打开拉萨JFK拉萨三点' },
		// 	{ hotword: '113是东方大厦开了房间萨拉' },
		// 	{ hotword: '1145适当放大撒范德萨范德萨' },];
		// this.setState({ hotWordsArr });
		// let hotLabelArr = [
		// 	{ labelName: '当接口' },
		// 	{ labelName: '山东分局飒飒' },
		// 	{ labelName: '圣诞节反抗拉萨就' },
		// 	{ labelName: '手机打开了附近的萨克了' },
		// 	{ labelName: '时间考虑发家的斯科拉JFK达拉斯' },
		// 	{ labelName: '山东分局飒飒' },
		// 	{ labelName: '圣诞节反抗拉萨就' },
		// 	{ labelName: '手机打开了附近的萨克了' },
		// 	{ labelName: '时间考虑发家的斯科拉JFK达拉斯' },
		// 	{ labelName: '山东分局飒飒' },
		// 	{ labelName: '圣诞节反抗拉萨就' },
		// 	{ labelName: '手机打开了附近的萨克了' },
		// 	{ labelName: '时间考虑发家的斯科拉JFK达拉斯' },
		// 	{ labelName: '山东分局飒飒' },
		// 	{ labelName: '圣诞节反抗拉萨就' },
		// 	{ labelName: '手机打开了附近的萨克了' },
		// 	{ labelName: '时间考虑发家的斯科拉JFK达拉斯' },
		// 	{ labelName: '时间考虑附近的卡死了解放开绿灯撒解开了' },];
		// this.setState({ hotLabelArr });
	}
	renderHotSearch = () => {
		if (!this.state.hotWordsArr.length) {
			return null;
		}
		let searchTags = [];
		this.state.hotWordsArr.map((item, index) => {
			searchTags.push(<SearchTag label={item.hotword} index={index + 1} key={index} onPress={this.touchHotWrods(item)} />);
		});
		return (
			<View style={searchStyle.hotWrap}>
				<Panel title="热门搜索" style={searchStyle.panel}></Panel>
				<View style={[searchStyle.searchTags]}>{searchTags}</View>
			</View>
		);
	}
	renderHotLabel = () => {
		if (!this.state.hotLabelArr.length) {
			return null;
		}
		let hotLabels = [];
		this.state.hotLabelArr.map((item, index) => {
			hotLabels.push(
				<Tag
					key={index}
					style={searchStyle.hotLabelWrap}
					onPress={this.touchHotLabel(item)}
					textStyle={searchStyle.hotLabel}>
					{item.labelName}
				</Tag>);
		});
		return (
			<View style={[searchStyle.hotWrap]}>
				<Panel title="热门标签" style={searchStyle.panel} />
				<TagGroup style={searchStyle.searchTags}>{hotLabels}</TagGroup>
			</View>
		);
	}
	touchHotLabel = (item) => () => {
		// this.props.onHotWordPress && this.props.onHotWordPress(item.labelName);
		// YZhugeIo.track('4热门标签', {
		// 	热门标签文字: item.labelName
		// });
		this.props.navigation.navigate('ArticleTag', {
			tagId: item.kid,
			tagName: item.labelName,
		});
	}
	touchHotWrods = (item) => () => {
		this.props.onHotWordPress && this.props.onHotWordPress(item.hotword);
		// YZhugeIo.track('4热门搜索', {
		// 	热门搜索文字: item.hotword
		// });
	}

}
const searchStyle = StyleSheet.create({
	divider: {
		height: styles.transformSize(20),
		backgroundColor: '#eeeeee'
	},
	searchTags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	hotWrap: {
		paddingHorizontal: styles.transformSize(40),
		paddingBottom: styles.transformSize(18),
	},
	hotLabelWrap: {
		paddingHorizontal: styles.transformSize(24),
		paddingVertical: styles.transformSize(16),
		backgroundColor: '#f4f4f4',
		marginRight: styles.transformSize(16),
		marginBottom: styles.transformSize(16),
		borderRadius: styles.transformSize(4),
		borderWidth: 0,
	},
	hotLabel: {
		fontSize: styles.transformSize(26),
		color: '#666',
		includeFontPadding: false,
	},
	panel: {
		borderBottomWidth: 0,
		paddingLeft: 0,
	}
});