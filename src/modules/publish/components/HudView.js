import React from 'react'
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Text
} from 'react-native'
import {
	commonStyle
} from '@utils'

export default class HudView extends React.Component {
	render() {
		return (
			<View style={{
				position: 'absolute',
				top: 0, left: 0, height: commonStyle.SCREEN_HEIGHT, width: commonStyle.SCREEN_WIDTH, backgroundColor: 'transparent',
			}} >
				<View style={{ top: (commonStyle.SCREEN_HEIGHT - 100) / 2 - 64, left: (commonStyle.SCREEN_WIDTH - 100) / 2, height: 100, width: 100, backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
					<ActivityIndicator />
					<Text style={{ padding: 5, color: 'white' }}>上传中...</Text>
				</View>
			</View>
		)
	}
}


