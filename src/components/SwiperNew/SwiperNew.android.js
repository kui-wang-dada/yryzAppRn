// https://snack.expo.io/H1CnjIeDb
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, ViewPagerAndroid, InteractionManager } from 'react-native';
// import { YViewPagerAndroid } from '@ydk';
// import YViewPagerAndroid from './YViewPagerAndroid';
import { YryzViewPagerAndroid } from '@native-modules';
import { transformSize } from "@utils"
const { width, height } = Dimensions.get('window');
let _onPageScroll = (e) => {
	let { offset, position } = e.nativeEvent

	// console.log(`_onPageScroll position: ${position}`)
	// if (index === total - 2) {
	// 	if (position === total - 2) {
	// 		if (offset >= 0.1) {

	// 			this.props.navigation.navigate("CategoryTab")
	// 			this.YViewPagerAndroid.setPageWithoutAnimation(total - 2);
	// 		} else {
	// 			this.YViewPagerAndroid.setPageWithoutAnimation(total - 2);
	// 		}
	// 	}
	// }
}

export default class SwiperNew extends Component {

	constructor(props) {
		super(props);
		this.pageIndex = 0;
	}
	state = { key: 0 }





	_onPageScrollStateChanged = (e) => {

	}
	_onPageSelected = (e) => {
		let { position } = e.nativeEvent;
		this.pageIndex = position;

		console.log(`_onPageSelected position: ${position} pageIndex:${this.pageIndex} `)



		this.props.onChangeIndex(this.pageIndex)

		if (position === this.total - 1) {

			this.props.getArticleList()
		}

	}

	goToFirst = () => {

		this.YViewPagerAndroid.setPage(1);
	}
	componentWillUpdate() {
		let { key } = this.state
		if (this.total === key) return;
		InteractionManager.runAfterInteractions(() => {
			this.setState({ key: this.total })

		});

	}
	render() {

		this.total = this.props.children ? this.props.children.length || 1 : 0;
		let blockList = this.props.children;
		// this.YViewPagerAndroid
		let blockEls = blockList.map((item, index) => {

			return (
				<View style={style.pageStyle} key={index}>
					{item}
					{/* <Text>等我大方块</Text> */}
				</View>
			)
		})



		return (
			<View style={[style.container]}>
				{/* <ViewPagerAndroid
					key={this.state.key.toString()}
					ref={ref => this.YViewPagerAndroid = ref}
					style={style.viewPager}
					// peekEnabled={true}
					// pageMargin={20}
					// clipToPadding={false}
					// clipPadding={{ left: 30, right: 30 }}
					initialPage={this.pageIndex}
					onPageScroll={_onPageScroll}
					onPageScrollStateChanged={this._onPageScrollStateChanged}
					onPageSelected={this._onPageSelected}
				>
					{blockEls}
				</ViewPagerAndroid> */}
				<YryzViewPagerAndroid
					clipToPadding={false}
					clipPadding={{ left: transformSize(90), right: transformSize(90) }}
					initialPage={this.pageIndex}
					style={{ flex: 1 }}
					ref={(s) => this._refScrollView = s}
					key={this.state.key.toString()}
					onPageSelected={this._onPageSelected}
					removeClippedSubviews={true}
				>
					{blockEls}
				</YryzViewPagerAndroid>
			</View>
		);


	}
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	viewPager: {
		height: '100%',
		backgroundColor: '#fff',
	},
	pageStyle: {
		// borderRadius: styles.transformSize(30),
		// height: '100%',
		flex: 1,
		alignItems: 'center',

	},

	pagination_x: {
		position: 'absolute',
		bottom: 25,
		left: 0,
		right: 0,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent'
	},
});

