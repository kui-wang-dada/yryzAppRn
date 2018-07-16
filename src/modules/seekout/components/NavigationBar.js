import React, { Component } from 'react';
import { ImageBackground, ART, Animated, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
	StyleSheet,
	ScrollView,
	View,
	Tag,
	TagGroup,
	Panel,
	Image,
	Icon,
	Touchable,
	FlowList,
	Text,
	ActionSheet,
	Share,
	withNavigation
}
	from '@components';
import { commonStyle as styles } from '@utils';
import commonStyle from '@utils/commonStyle';
import cache from '@utils/cache';
@withNavigation
export default class extends Component {

	state = {
		opacity: new Animated.Value(0)
	};

	componentWillReceiveProps(nextProps) {
		// Animated.spring(
		// 	this.state.opacity,
		// 	{
		// 		toValue: nextProps.opacity,
		// 	}
		// ).start();
	}


	renderNav(opacity) {
		let nextStyle = opacity ? { color: 'white' } : {};
		return (
			<View
				style={[decorate.navBarInner]}>
				<Touchable onPress={() => this.props.navigation.goBack()}>
					<Icon name="arrow-left" style={[decorate.navBarLeft, nextStyle]} />
				</Touchable>
				{
					<View style={opacity ? { opacity: 0 } : {}}>
						{this.props.children}
					</View>
				}
				<Touchable onPress={this.props.more}>
					<Icon name="more" style={[decorate.navBarRight, nextStyle]} />
				</Touchable>
			</View >
		);
	}


	renderInner() {
		let { scrollY } = this.props;
		let opacity = scrollY.interpolate({
			inputRange: [0, 30, 50],
			outputRange: [0, 0.5, 1],
			extrapolate: 'clamp',
		});
		return (
			<Animated.View style={[decorate.navBar, { backgroundColor: 'white' }, { opacity }]}>
				{this.renderNav()}
			</Animated.View>
		);

	}

	renderWrapper() {
		let { scrollY } = this.props;
		let opacity = scrollY.interpolate({
			inputRange: [0, 30, 50],
			outputRange: [1, 0.5, 0],
			extrapolate: 'clamp',
		});
		return (
			<Animated.View style={[decorate.navBar, { opacity }, { borderColor: 'transparent' }]}>
				{this.renderNav(true)}
			</Animated.View>
		);
	}


	render() {
		return (
			<View>
				{this.renderInner()}
				{this.renderWrapper()}
			</View>
		);
	}

}

// 装饰
const decorate = StyleSheet.create({
	navBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		height: styles.transformSize(116),
		justifyContent: 'flex-end',
		zIndex: 9,
		paddingBottom: styles.transformSize(16),
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: '#e5e5e5'
	},
	navBarInner: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	navBarAndroid: {
		height: styles.transformSize(80),
		alignItems: 'center',
	},
	navBarIos: {
		height: styles.transformSize(128),
		paddingBottom: styles.transformSize(28),
		alignItems: 'flex-end',
	},
	navBarLeft: {
		paddingHorizontal: styles.transformSize(30),
		fontSize: styles.transformSize(33),
		color: 'black'
	},
	navBarRight: {
		paddingHorizontal: styles.transformSize(30),
		fontSize: styles.transformSize(10),
		justifyContent: 'center',
		alignItems: 'center',
		color: 'black'
	}
});