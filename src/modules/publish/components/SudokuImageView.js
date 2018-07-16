///九宫格图片View

import React from 'react'
import {
	View,
	Image,
	FlatList,
	TouchableOpacity,
	StyleSheet,
} from 'react-native'
import {
	transformSize,
	commonStyle,
} from '@utils'

import {
	Icon,
} from '@components'


const ItemWidth = (commonStyle.SCREEN_WIDTH - transformSize(30) * 2 - 5 * 2) / 3;

export default class SudokuImageView extends React.Component {

	_renderItem = ({ item, index }) => {


		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						this.props.imageDidClick(index);
					}}
					activeOpacity={0.2}
					focusedOpacity={0.5}>
					<Image style={[styles.imageStyle, { width: ItemWidth, height: ItemWidth }]}
						source={{ uri: 'file://' + item }}
						resizeMode={'cover'}
					/>
					<Icon
						style={styles.deleteIconStyle}
						onPress={() => {
							this.props.deleteClick(index);
						}}
						name="delete"
						size={20}
						color="rgba(171, 171, 171, 0.6)" />
				</TouchableOpacity>
			</View>
		)

	}

	render() {
		return (
			<FlatList
				style={styles.imageViewStyle}
				keyExtractor={(item, index) => index}
				data={this.props.data}
				renderItem={this._renderItem}
				scrollEnabled={false}
				numColumns={3}
			/>
		)
	}
}

const styles = StyleSheet.create({
	imageViewStyle: {
		marginLeft: transformSize(30)
	},
	imageStyle: {
		marginBottom: 5,
		marginRight: 5,
		resizeMode: Image.resizeMode.stretch,
		backgroundColor: commonStyle.color_background
	},
	deleteIconStyle: {
		zIndex: 100,
		position: 'absolute',
		marginTop: transformSize(10),
		marginLeft: transformSize(170),
	}
})