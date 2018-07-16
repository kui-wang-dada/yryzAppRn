// https://snack.expo.io/H1CnjIeDb
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { transformSize } from '@utils/commonStyle';

const { width, height } = Dimensions.get('window');

export default class SwiperNew extends Component {
	state = {
		index: 0,
		total: this.props.children ? this.props.children.length || 1 : 0,

	}


	componentDidMount() {

		this.scrollView && this.scrollView.scrollTo({ x: -transformSize(90) }) // scroll view position fix
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ total: nextProps.children ? nextProps.children.length || 1 : 0 })
	}
	onScrollBegin = () => {

	}


	onScrollEnd = (e) => {
		let { index, total } = this.state
		let { contentOffset } = e.nativeEvent

		let x = contentOffset.x
		let bei = (x + transformSize(90)) / (width - transformSize(180))
		if (bei <= total - 1) {
			let index = Math.round(bei)
			if (index === 0) {
				this.scrollView && this.scrollView.scrollTo({ x: -transformSize(90) })
			}
			this.setState({ index })
			this.props.onChangeIndex(index)
	

		}

	}
	onScrollEndDrag = (e) => {
		let { index, total } = this.state
		let widthAll = (total - 2) * (width - transformSize(180)) - transformSize(90)
		let { contentOffset } = e.nativeEvent

		if (contentOffset.x >= widthAll) {
			this.props.getArticleList()
		}
	}
	goToFirst = () => {
		this.scrollView.scrollTo({ x: -30, y: 0, animated: true })
	}
	renderPagination = () => {
		if (this.state.total <= 1) return null
		let { index, total } = this.state

		let dots = []
		const ActiveDot = this.props.activeDot || <View style={[{
			backgroundColor: this.props.activeDotColor || '#007aff',
			width: 8,
			height: 8,
			borderRadius: 4,
			marginLeft: 3,
			marginRight: 3,
			marginTop: 3,
			marginBottom: 3
		}, this.props.activeDotStyle]} />
		const Dot = this.props.dot || <View style={[{
			backgroundColor: this.props.dotColor || 'rgba(0,0,0,.2)',
			width: 8,
			height: 8,
			borderRadius: 4,
			marginLeft: 3,
			marginRight: 3,
			marginTop: 3,
			marginBottom: 3
		}, this.props.dotStyle]} />
		if (index === total - 1) {
			index = total - 2
		}
		for (let i = 0; i < total - 1; i++) {
			dots.push(i === this.state.index
				? React.cloneElement(ActiveDot, { key: i })
				: React.cloneElement(Dot, { key: i })
			)
		}

		return (
			<View pointerEvents='none' style={[styles.pagination_x, this.props.paginationStyle]}>
				{dots}
			</View>
		)
	}
	renderScrollView = pages => {

		return (
			<ScrollView
				ref={(scrollView) => { this.scrollView = scrollView; }}
				contentContainerStyle={styles.scrollView}
				scrollsToTop
				horizontal={true}
				decelerationRate={0}
				snapToInterval={width - transformSize(180)}
				snapToAlignment={"center"}
				onMomentumScrollEnd={this.onScrollEnd}
				onScrollEndDrag={this.onScrollEndDrag}
				onScrollBeginDrag={this.onScrollBegin}
				showsHorizontalScrollIndicator={false}
				contentInset={{
					top: 0,
					left: 30,
					bottom: 0,
					right: 30,
				}}
			>
				{pages}
			</ScrollView>
		)
	}



	render() {
		const {
			index,
			total,
			width,
			height
		} = this.state;
		const {
			children,
			containerStyle,
			loop,
			loadMinimal,
			loadMinimalSize,
			loadMinimalLoader,
			renderPagination,
			showsButtons,
			showsPagination,
		} = this.props;
		return (
			<View style={[styles.container, containerStyle]}>
				{this.renderScrollView(children)}
			</View>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1

	},
	scrollView: {
		backgroundColor: '#eee',
		height: '100%'
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

