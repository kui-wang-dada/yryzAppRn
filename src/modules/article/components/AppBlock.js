import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from '@components';
import { navigation, http } from '@services';
import { commonStyle, umengTrack } from '@utils';
export default class extends Component {
	render() {
		let { application = {}, payFlag, payedFlag, guideShoppingUrl } = this.props.data;

		let payToView = (
			<Text style={style.viewText} onPress={this.viewApp}>1 元查看</Text>
		)
		let ableViewApp = !(payFlag && !payedFlag);
		if (Platform.OS === 'ios') {
			if (!ableViewApp) {
				return payToView;
			}
			if (!guideShoppingUrl) {
				return <View />;
			}
			return (
				<Text style={style.appName} onPress={this.handlePressIosApp}>查看详情</Text>
			)
		} else {
			if (!ableViewApp) {
				return payToView;
			}
			return (
				<Text style={style.appName} onPress={this.toAppDetail}>@ {application.appliName}</Text>
			);
		}

	}
	viewApp = () => {
		let { id } = this.props.data;
		Alert.alert(
			'', '是否使用1悠然币查看应用？',
			[
				{ text: '否', onPress: () => console.log('取消'), style: 'cancel' },
				{
					text: '是', onPress: async () => {
						let res = await http({ url: `/services/app/v1/article/pay/${id}`, method: 'post' });
						if (res.data.data.id) {
							this.props.onPayForApp && this.props.onPayForApp(res.data.data);
						}
					},
				}
			]
		)
	}
	handlePressIosApp = () => {
		navigation.navigate('WebViewScreen', {
			url: this.props.data.guideShoppingUrl
		});
	};
	toAppDetail = () => {
		navigation.navigate('AppDetail', { id: this.props.data.application.id });
		umengTrack('应用详情页', { '来源': '文章详情页' });

	}
}

const style = StyleSheet.create({

	viewApp: {
		width: commonStyle.transformSize(570),
		height: commonStyle.transformSize(100),
		...commonStyle.centerWrap,
		alignSelf: 'center',
	},
	viewText: {
		color: '#7762e1',
		backgroundColor: 'transparent',
		fontSize: commonStyle.transformSize(24),
	},
	appName: {
		color: '#7762e1',
		fontSize: commonStyle.transformSize(24),
	},
});