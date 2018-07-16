import React from 'react'
import {
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet
} from 'react-native'

import SudokuImageView from './SudokuImageView'
import VideoView from './VideoView'

const datas = ['123', '123', '123', '123', '123', '123', '123', '123']

const ContentType = {
	Text: 0,  //文本
	Image: 1, //图片
	Video: 2  //视频
}



export default class PhotosSourceView extends React.Component {

	constructor(props) {
		super(props);
	}

	imageScource() {
		return (
			<SudokuImageView
				data={this.props.data.images}
				deleteClick={(index) => {
					this.props.deleteImageClick(index);
				}}
				imageDidClick={(index) => {
					this.props.imageDidClick(index);
				}}
			/>
		)
	}

	videoSource() {
		return (
			<VideoView
				videoInfo={this.props.data.videoInfo}
				videoPlay={() => {
					this.props.videoPlay();
				}}
				videoDelete={() => {
					this.props.videoDelete();
				}}
			/>
		)
	}


	contentView() {
		switch (this.props.data.contentType) {
			case ContentType.Text:
				return null
			case ContentType.Image:
				{
					return (this.imageScource())
				}
			case ContentType.Video:
				{
					return (this.videoSource())
				}
		}

	}


	render() {
		return (
			<View style={styles.container}>
				{this.contentView()}
			</View>
		)
	}
}

const styles = StyleSheet.create({


})

