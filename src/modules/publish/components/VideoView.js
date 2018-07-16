
import React from 'react'
import {
	View,
	Image,
	TouchableOpacity,
	StyleSheet,
	Dimensions
} from 'react-native'
import {
	transformSize,
	commonStyle,
} from '@utils'

import {
	Icon,
} from '@components'

const SCREEN_WIDTH = Dimensions.get('window').width;      //设备的宽度

export default class VideoView extends React.Component {

	render() {
		return (
			<TouchableOpacity
				onPress={() => {
					this.props.videoPlay();
				}}
				activeOpacity={0.2}
				focusedOpacity={0.5}>
				<View style={styles.container}>
					<Image style={styles.videoPicStyle}
						source={{ uri: 'file://' + this.props.videoInfo.thumbnailPath }}
					/>
					<View style={styles.videoPlayViewStyle}>

						<Image
							style={styles.playIconStyle}
							source={require('@assets/images/video_play.png')} />
						<View style={styles.deleteViewStyle}>
							<TouchableOpacity
								onPress={() => {
									this.props.videoDelete();
								}}
								activeOpacity={0.2}
								focusedOpacity={0.5}>
								<Icon
									style={styles.deleteImageStyle}
									name="delete"
									size={15}
									color="rgba(171, 171, 171, 0.7)" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableOpacity>

		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	videoPicStyle: {
		marginLeft: transformSize(30),
		marginRight: transformSize(30),
		height: transformSize(550),
		backgroundColor: commonStyle.color_background
	},
	videoPlayViewStyle: {
		flexDirection: 'row',
		height: transformSize(550),
		zIndex: 100,
		position: 'absolute',
	},
	playIconStyle: {
		width: transformSize(90),
		height: transformSize(90),
		top: transformSize(255),
		left: commonStyle.SCREEN_WIDTH / 2 - transformSize(40),
	},
	deleteViewStyle: {
		height: transformSize(40),
		width: transformSize(40),
		marginTop: transformSize(16),
		marginLeft: commonStyle.SCREEN_WIDTH - transformSize(170),
	},
	deleteImageStyle: {
		height: transformSize(40),
		width: transformSize(40),
	}

})