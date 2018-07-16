import React from 'react';
import {
	StyleSheet,
	View,
	FlowList,
	Text,
} from '@components';
import {
	commonStyle, transformSize
} from '@utils';
import { HomeItemHor, HomeItemVer, HomeItemVideo } from '@modules/home';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.tagId = this.props.navigation.state.params.tagId;
		this.tagName = this.props.navigation.state.params.tagName;
		this.props.navigation.setParams({ 'title': this.tagName });
	}
	static navigationOptions = ({ navigation }) => {
		let title = navigation.getParam('title');
		return {
			headerTitle: <View style={decorate.headerWrap}><Text style={decorate.headerText}>{title}</Text></View>,
			headerStyle: {
				borderBottomWidth: StyleSheet.hairlineWidth,
				elevation: 0,
				borderBottomColor: '#e5e5e5',
			}
		}
	}
	render() {
		let articleUrl = {
			url: '/services/app/v1/article/label/list', params: {
				labelId: this.tagId,
			}
		};

		let httpUrl = articleUrl;
		let _renderItem = this.renderItem;

		return (
			<FlowList
				style={decorate.container}
				request={httpUrl}
				renderItem={_renderItem}
				ItemSeparatorComponent={() => <View style={decorate.segemation}></View>}
			/>
		);
	}
	renderItem = ({ item }) => {
		let { videoUrl, coverImgType } = item;
		if (videoUrl) {
			return (
				<HomeItemVideo
					data={item}
					goToDetail={this.goToVideoDetail(item.id)}
				></HomeItemVideo>
			)
		}
		if (coverImgType === 1) {
			return (
				<HomeItemHor
					data={item}
					goToDetail={this.goToDetail(item.id)}
				></HomeItemHor>
			)
		} else {
			return (
				<HomeItemVer
					data={item}
					goToDetail={this.goToDetail(item.id)}
				></HomeItemVer>
			)
		}
	}

	goToVideoDetail = (id) => () => {
		this.props.navigation.navigate('VideoDetail', { id });
	}
	goToDetail = (id) => () => {
		this.props.navigation.push('ArticleDetail', { id });
	}

	componentDidMount() {
	}
}

const decorate = StyleSheet.create({
	container: {
		backgroundColor: '#fff'
	},
	segemation: {
		height: transformSize(16),
	},
	headerWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		paddingHorizontal: commonStyle.transformSize(100),
	},
	headerText: {
		fontSize: commonStyle.transformSize(34),
		fontWeight: 'bold',
		color: '#000',
	},
});