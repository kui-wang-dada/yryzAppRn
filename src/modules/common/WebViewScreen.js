import React, { Component } from 'react';
import { WebView } from 'react-native';
import { StyleSheet, View, Toast, Button, Text, Touchable, Share } from '@components';
import PropTypes from 'prop-types';
import { commonStyle, modal } from '@utils';

export default class WebViewScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		let { params } = navigation.state;
		let title = navigation.getParam('title');
		let menuVisible = navigation.getParam('menuVisible');
		let handleShare = navigation.getParam('shareHandler');
		return {
			headerTitle: title,
			headerStyle: {
				borderBottomWidth: StyleSheet.hairlineWidth,
				elevation: 0,
				borderBottomColor: '#e5e5e5',
			},
			headerTitleStyle: {
				flex: 1,
				textAlign: 'center',
			},
			headerRight: menuVisible ? <Touchable style={style.headerRight} onPress={handleShare}><Text>分享</Text></Touchable> : <View />
		}
	}

	constructor(props) {
		super(props);
		let { url } = props.navigation.state.params;
		url = decodeURIComponent(url);
		this.state = { title: '载入中...', url, menuVisible: this.shouldShowMenu(url) };
		this.props.navigation.setParams({ title: this.state.title, menuVisible: this.state.menuVisible });
	}

	handleLoadStart = () => {
		var script = 'window.__yryz=true';
		this._webView && this._webView.injectJavaScript(script);
	}

	handleNavigationStateChange = (e) => {
		this.canGoBack = e.canGoBack;
		this.setState({ title: e.title });
		this.props.navigation.setParams({ title: e.title, shareHandler: this.handleShare });
	}

	handleBack = () => {
		return true
	}

	render() {
		return (
			<View style={[style.container]}>
				<WebView source={{ uri: this.state.url }}
					onLoadStart={this.handleLoadStart}
					onNavigationStateChange={this.handleNavigationStateChange}
					ref={ref => { this._webView = ref; }}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					onMessage={this.handleMessage}
					renderError={this._renderError}
					onLoadEnd={this.handleLoadEnd}
					// for android: WebView应该允许https页面中加载非安全http的内容
					mixedContentMode={'always'}
				// nativeConfig={{ props: { backgroundColor: '#fff', flex: 1 } }}
				></WebView>
			</View>

		);
	}


	static propTypes = {
		url: PropTypes.string,
	}

	_renderError = () => {
		return <View style={{ width: 0, height: 0 }}></View>
	}
	handleMessage = async (event) => {
		let data = event.nativeEvent.data;
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}

	}

	renderNavRight = () => {
		return (
			<Button transparent>
				<Text>分享</Text>
			</Button>
		);
	};

	shouldShowMenu = (url) => {
		let { menuVisible = true } = this.props.navigation.state.params;
		return menuVisible && !/m.+\.yryz\.com\/myShare/.test(url);
	};
	handleShare = () => {
		let data = {
			title: this.state.title,
			content: '',
			url: this.state.url,
		}
		let component = (<Share  {...this.props} data={data} />)
		modal.show(component, 'share');
	}

}
const style = StyleSheet.create({
	container: {
		flex: 1,
	},
	viewWrap: {
		backgroundColor: 'red',
	},
	headerText: {
		fontSize: commonStyle.transformSize(34),
		fontWeight: 'bold',
		color: '#000',
		alignSelf: 'center',
	},
	headerRight: {
		marginRight: commonStyle.transformSize(30),
	}
});