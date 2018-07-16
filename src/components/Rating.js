/**
 * author: AiQingmin
 */
import React, { Component } from 'react';
import { StyleSheet } from './'
import { Rating } from 'react-native-elements'

export default class StarRating extends Component {
	static defaultProps = {
		type: 'star',
		showRating: false,
		ratingCount: 5,
		fractions: 2,
		startingValue: 2,
		imageSize: 20,
		ratingBackgroundColor: 'transparent'

	};
	render() {
		const styleRating = [s.Rating, this.props.style]
		const { type, showRating, ratingCount, fractions, startingValue, imageSize, onFinishRating, ...otherProps } = this.props
		return (

			<Rating
				type={type}
				showRating={showRating}
				ratingCount={ratingCount}
				fractions={fractions}
				startingValue={startingValue}
				imageSize={imageSize}
				onFinishRating={onFinishRating}
				style={styleRating}
				{...otherProps}
			>
			</Rating>
		)
	}

}
const s = StyleSheet.create({
	Rating: {
		paddingVertical: 10,
	}
});
