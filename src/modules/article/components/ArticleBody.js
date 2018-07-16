import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	WebView,
	ImageBackground,
	DeviceEventEmitter,
	View,
	Text,
	ImagePreview,
	Platform,
} from '@components';
import { env, commonStyle, modal } from '@utils';
import { placeholderImg } from '../assets';

class ArticleBody extends React.Component {
	render() {
		const title = this.props.title ? <Text style={style.title}>{this.props.title}</Text> : null;
		return (
			<View style={[style.main, this.props.style]}>
				{title}
				{this.props.beforeContent}
				{this.renderContent()}
				{this.renderMaskView()}
			</View>
		);
	}

	renderContent() {
		const uri = `${env.webBaseUrl}/article-content/${this.props.id}`
		return this.props.id ? (
			<WebView
				source={{ uri }}
				scrollEnabled={false}
				ref={c => this._webview = c}
				onMessage={this.handleWebViewMessage}
				renderError={this._renderError}
				style={{ marginTop: commonStyle.transformSize(30) }}
			/>
		) : <Text style={style.content}>{this.props.content}</Text>;
	}
	renderMaskView() {
		if (!this.props.id) return null;
		return (
			<ImageBackground source={placeholderImg} ref={c => this._maskView = c} style={style.placeholderWrap} />
		)
	}

	_renderError = () => {
		return <View style={{ width: 0, height: 0 }}></View>
	}

	componentDidMount() {
		this.subscription = DeviceEventEmitter.addListener('openSignModal', () => {
			this.pauseAllVideo();
		});
		this.props.onRouteChange && this.props.onRouteChange(() => {
			this.pauseAllVideo();
		})

	}
	componentWillUnmount() {
		this.pauseAllVideo();
		this.subscription.remove();
	}
	pauseAllVideo = () => {
		let script = `var videos = document.querySelectorAll('video');
		for(var i=0;i<videos.length;i++)
		{var video = videos[i]; video.pause()};`;

		this._webview && this._webview.injectJavaScript(script);
	}

	handleWebViewMessage = (e) => {

		if (!e.nativeEvent.data) {
			return;
		}
		try {
			const message = JSON.parse(e.nativeEvent.data);
			switch (message.type) {
				case 'height-change': {
					// console.warn('height', message, message.data);
					this._webview.refs.webview.setNativeProps({ style: { height: message.data } });
					this._maskView.setNativeProps({ style: { display: 'none' } });
					break;
				}
				case 'preview-images': {
					// console.log('message data', message.data);
					let { images, index } = message.data;
					images = images.map((item) => { return { source: { uri: item } } });
					let previewNode = (<ImagePreview
						imageUrls={images}
						checkQRCode={true}
						initialPage={index}
						onClick={(page) => {
							modal.close();
						}}
						onQRResponse={(response) => {
						}}
					/>);
					modal.show(previewNode);
					break;
				}
			}
		} catch (ex) {
			console.log(ex, e.nativeEvent.data)
		}
	};

	state = {
		webViewHeight: 0,
	};

	static propTypes = {
		id: PropTypes.number,
		title: PropTypes.string,
		content: PropTypes.string,
		contentSource: PropTypes.string,
		beforeContent: PropTypes.node
	};

	static defaultProps = {
		beforeContent: null
	};
}

const style = StyleSheet.create({
	main: {
		paddingVertical: commonStyle.transformSize(55),
		backgroundColor: 'white',
		paddingHorizontal: commonStyle.padding,
	},
	title: {
		fontSize: commonStyle.transformSize(44),
		// marginBottom: commonStyle.transformSize(46),
		fontWeight: Platform.select({ ios: '600', android: '500' }),
		color: '#000',
		lineHeight: commonStyle.transformSize(54),
	},
	content: {
		fontSize: commonStyle.transformSize(34),
		lineHeight: commonStyle.transformSize(56),
	},
	placeholderWrap: {
		height: commonStyle.transformSize(872),
	},
});

export default ArticleBody;
