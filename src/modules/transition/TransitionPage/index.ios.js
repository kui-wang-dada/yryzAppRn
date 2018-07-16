import React from 'react';
import {
	View,
	Dimensions,
	StyleSheet,
} from 'react-native';
import { transformSize, isIphoneX } from '@utils'
import LottiePage from './LottiePage';
import Swiper from 'react-native-swiper';
import SvgView from '@components/SvgView';
import Touchable from '@components/Touchable';
import YIcon from '@components/YIcon';
import font1svg from './assets/font1svg.ios';
import font2svg from './assets/font2svg.ios';
import font4svg from './assets/font4svg.ios';
import entersvg from './assets/entersvg';
export default class TransitionPage extends React.Component {

	handleIndexChanged = (index) => {
		let lottiePage = this['lottie' + (index + 1)];
		lottiePage && lottiePage.play();
	}
	handleLayout = () => {
		this.handleIndexChanged(0);
	}

	renderPagination = (index) => {
		if (index === 2) {
			return (
				<Touchable activeOpacity={1} onPress={this.props.onPress} style={styles.buttonWarp}>
					<SvgView svgXmlData={entersvg} style={styles.enter} />
				</Touchable>
			);
		};
		if (index === 0) {
			return (
				<View style={styles.docWarp}>
					<YIcon name="point" style={styles.point} />
					<YIcon name="point-gray" style={styles.gray} />
					<YIcon name="point-gray" style={styles.gray} />
				</View>);
		};
		if (index === 1) {
			return (
				<View style={styles.docWarp}	>
					<YIcon name="point-gray" style={styles.gray} />
					<YIcon name="point" style={styles.point} />
					<YIcon name="point-gray" style={styles.gray} />
				</View>
			);
		}
	}
	render() {
		return (
			<Swiper style={styles.wrapper} loop={false} showsButtons={false}
				onIndexChanged={this.handleIndexChanged} showsPagination={true}
				renderPagination={this.renderPagination}
				dot={[styles.dot,]}
				activeDot={styles.activeDot}
			>
				<View style={styles.slide} onLayout={this.handleLayout}>
					<SvgView svgXmlData={font1svg} style={styles.font1} />
					<LottiePage ref={(l) => this.lottie1 = l} source={require('./assets/lottie1.json')} style={styles.lottie} />
				</View>
				<View style={styles.slide}>
					<SvgView svgXmlData={font2svg} style={styles.font2} />
					<LottiePage ref={(lot) => this.lottie2 = lot} source={require('./assets/lottie2.ios.json')} style={styles.lottie} />
				</View>
				<View style={styles.slide}>
					<SvgView svgXmlData={font4svg} style={styles.font4} />
					<LottiePage ref={(lot) => this.lottie3 = lot} source={require('./assets/lottie4.json')} style={styles.lottie} />
				</View>
			</Swiper>
		);
	}
}

const baseWidth = 1240;
const { width } = Dimensions.get('window');
function getFinalHeight(designHeight) {
	let height = Number.parseInt(designHeight * width / baseWidth);
	return height;
}
function getFinalWidth(designWidth) {
	let height = Number.parseInt(designWidth * width / baseWidth);
	return height;
}

const styles = StyleSheet.create({
	wrapper: {
	},
	slide: {
		flex: 1,
		paddingTop: isIphoneX() ? 85 : 45,
		alignItems: 'center',
	},
	image: {
		width,
		flex: 1
	},
	lottie: {
		width: width,
		height: getFinalHeight(1476)
	},
	font1: {
		marginBottom: isIphoneX() ? 73 : 33,
		width: getFinalWidth(853),
		height: getFinalHeight(199)
	},
	font2: {
		marginBottom: isIphoneX() ? 73 : 33,
		width: getFinalWidth(585),
		height: getFinalHeight(199)
	},
	font4: {
		marginBottom: isIphoneX() ? 73 : 33,
		width: getFinalWidth(595),
		height: getFinalHeight(199)
	},
	buttonWarp: {
		position: "absolute",
		bottom: isIphoneX() ? transformSize(170) : transformSize(100),
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	docWarp: {
		flexDirection: 'row',
		width: width,
		position: "absolute",
		bottom: isIphoneX() ? transformSize(170) : transformSize(111),
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	enter: {
		width: getFinalWidth(340),
		height: getFinalHeight(120)
	},
	dot: {
		fontSize: 10,
		color: '#eee',
		marginLeft: 9
	},
	activeDot: {
		fontSize: 12,
		color: '#543dca',
		marginLeft: 9
	},
	gray: {
		fontSize: 10,
		color: '#eee',
		marginLeft: 9
	},
	point: {
		fontSize: 12,
		color: '#543dca',
		marginLeft: 9
	}
});
