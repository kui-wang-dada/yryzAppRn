import React from 'react';
import { StyleSheet, Linking, Platform, PixelRatio } from 'react-native';
import {
	Text,
	View,
	Icon,
	Touchable,
	withNavigation,
	FlatList,
	ScrollView
} from '@components';
import { transformSize, env } from '@utils';

// import { YShareSDK, YZhugeIo } from '@ydk';
// import { env } from '@utils';
// @withNavigation
export default class Setting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				{
					title: '《用户服务协议》',
					link: `${env.webBaseUrl}/static/page/user-agreement.html`,
				},
				{
					title: '《免责声明》',
					link: `${env.webBaseUrl}/static/page/disclaimer.html`,
				},
				{
					title: '《关于我们》',
					link: `${env.webBaseUrl}/static/page/about-us.html`,
				}
			]
		};
	}

	render() {
		return (
			<View style={styles.contMain}>
				{
					this.state.data.map((item, index) => {
						return this.renderItem(item, index)
					})
				}
			</View>
		);
	}

	componentDidMount() {
		// YZhugeIo.track('4我的_帮助');
	}


	renderItem(item, index) {
		let BLine = index !== this.state.data.length - 1 ? styles.BLine : null;
		return (
			<Touchable type="highlight" onPress={() => this.handleLink(item)} key={index}>
				<View style={styles.listItem}>
					<View style={[styles.listInner, BLine]}>
						<Text style={styles.text}>{item.title}</Text>
						<Icon name="arrow-right" style={styles.arrowRight} />
					</View>
				</View>
			</Touchable>
		);
	}


	handleLink = (item) => {
		let url = item.link;
		this.props.navigation.navigate('WebViewScreen', { url, menuVisible: false });
	}

	static navigationOptions = {
		headerTitle: '帮助',
		headerTitleStyle: { flex: 1, textAlign: 'center', fontWeight: '0' },
		headerRight: <View />
	};

}

const styles = StyleSheet.create({
	contMain: {
		flex: 1,
		backgroundColor: '#f4f4f4'
	},
	touchable: {
		width: '100%',
	},
	listItem: {
		backgroundColor: 'white'
	},
	listInner: {
		flexDirection: 'row',
		height: transformSize(107),
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: transformSize(30),
	},
	BLine: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#e3e3e3"
	},
	text: {
		fontSize: transformSize(32),
		color: '#000'
	},
	arrowRight: {
		fontSize: transformSize(30),
		color: '#bfbfbf',
		flex: 0,
		marginTop: transformSize(5)
	}
});
