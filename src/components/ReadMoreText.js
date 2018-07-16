import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { commonStyle } from '@utils';

export default class ReadMoreText extends React.Component {
	state = {
		measured: false,
		shouldShowReadMore: false,
		showAllText: false
	};

	async componentDidMount() {
		this._isMounted = true;
		await nextFrameAsync();

		if (!this._isMounted) {
			return;
		}

		// Get the height of the text with no restriction on number of lines
		const fullHeight = await measureHeightAsync(this._text);
		this.setState({ measured: true });
		await nextFrameAsync();

		if (!this._isMounted) {
			return;
		}

		// Get the height of the text now that number of lines has been set
		const limitedHeight = await measureHeightAsync(this._text);

		if (fullHeight > limitedHeight) {
			this.setState({ shouldShowReadMore: true }, () => {
				this.props.onReady && this.props.onReady();
			});
		} else {
			this.props.onReady && this.props.onReady();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		let { measured, showAllText, shouldShowReadMore } = this.state;

		let { numberOfLines } = this.props;

		return (
			<View style={styles.viewWrap}>
				<Text
					numberOfLines={measured && !showAllText ? numberOfLines : 0}
					ref={text => {
						this._text = text;
					}}
				>
					{this.props.children}
					{shouldShowReadMore && showAllText ?
						<Text style={[styles.button]} onPress={this._handlePressReadLess}> 收起</Text> : null}
				</Text>

				{this._maybeRenderReadMore()}
			</View>
		);
	}

	_handlePressReadMore = () => {
		this.setState({ showAllText: true });
	};

	_handlePressReadLess = () => {
		this.setState({ showAllText: false });
	};

	_maybeRenderReadMore() {
		let { shouldShowReadMore, showAllText } = this.state;

		if (shouldShowReadMore && !showAllText) {
			if (this.props.renderTruncatedFooter) {
				return this.props.renderTruncatedFooter(this._handlePressReadMore);
			}

			return (
				<Text style={[styles.button, styles.showMoreWrap, this.props.moreButtonStyle]} onPress={this._handlePressReadMore}>
					<Text style={styles.showMore}> 展开</Text>
				</Text>
			);
		} else if (shouldShowReadMore && showAllText) {
			if (this.props.renderRevealedFooter) {
				return this.props.renderRevealedFooter(this._handlePressReadLess);
			}

			// return (
			// 	<Text style={styles.button} onPress={this._handlePressReadLess}>
			// 		收起
			// 	</Text>
			// );
		}
	}
}

function measureHeightAsync(component) {
	return new Promise(resolve => {
		component.measure((x, y, w, h) => {
			resolve(h);
		});
	});
}

function nextFrameAsync() {
	return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
	button: {
		color: '#543dca',
		// marginTop: 5,
		fontSize: commonStyle.transformSize(30),
		backgroundColor: '#fff',
	},
	viewWrap: {
		position: 'relative',
	},
	showMoreWrap: {
		position: 'absolute',
		right: 0,
		bottom: Platform.select({
			'ios': commonStyle.transformSize(5),
			'android': commonStyle.transformSize(3)
		}),
	},
	showMore: {
		color: '#543dca',
		fontSize: commonStyle.transformSize(30),
	},
});
