import React from 'react'
import {
	View,
	Text
} from 'react-native'
import {
	SafeAreaView
} from 'react-navigation'
import {
	transformSize,
	commonStyle
} from '@utils'
import {
	VideoTrimView
} from 'ydk-react-native'
import { navigate } from '@services/navigation';

export default class VideoTrimScreen extends React.Component {

	render() {
		let { uri } = this.props.navigation.state.params
		let config = {
			filePath: uri,
			minDuration: 3,
			maxDuration: 15
		}
		return (

			<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
				<VideoTrimView
					ref={'TrimView'}
					style={{ width: commonStyle.SCREEN_WIDTH, height: '93%' }}
					config={config}
					onTrimResult={(e) => {
						let { success, video } = e.nativeEvent;
						const { navigate, goBack, state } = this.props.navigation;
						if (success == true) {
							state.params.callback(video);
							goBack();
						} else {
							state.params.callback(null);
							goBack();
						}
					}}
				/>
				<View style={{
					width: commonStyle.SCREEN_WIDTH, height: '7%', backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-between'
				}} >
					<Text style={{
						color: commonStyle.color_background, marginLeft: transformSize(30), marginTop: 0, marginBottom: 0, padding: 0
					}}
						onPress={() => {
							this.props.navigation.goBack()
						}}
					>取消</Text>
					<Text style={{ color: commonStyle.color_theme, marginRight: transformSize(30), marginTop: 0, marginBottom: 0, padding: 0 }}
						onPress={() => {
							this.refs.TrimView.trim();
						}}
					>完成</Text>
				</View >

			</SafeAreaView >
		)
	}
}
