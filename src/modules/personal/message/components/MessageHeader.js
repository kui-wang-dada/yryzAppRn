import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { View, Image, Text, Icon } from '@components';
import { transformSize, commonStyle } from '@utils';
import { Header } from 'react-navigation'

export default class MessageHeader extends React.Component {
	render() {

		let { showCheck, showRight } = this.props
		let rightView = null;
		if (showRight) {
			rightView = (<TouchableOpacity onPress={this.onTitleRight} style={styles.titleRight}>
				<Text style={{ color: "#a8a8a8", textAlign: 'right', fontSize: transformSize(30) }}>
					{showCheck ? '删除' : '编辑'}
				</Text>
			</TouchableOpacity>)
		}
		let leftView = <TouchableOpacity style={styles.titleLeft} onPress={this.onTitleLeft}>
			{
				showCheck ?
					<Text style={styles.titleCancel}>取消</Text> :
					<Icon name='arrow-left' style={styles.titleBack} />
			}
		</TouchableOpacity>
		let titleView = <Text style={{ fontSize: transformSize(34), color: '#000' }}>消息</Text>;
		let { options } = this.props.scene.descriptor
		options = {
			...options, headerLeft: leftView
			, headerRight: rightView
		}
		this.props.scene.descriptor.options = options
		return (
			Platform.OS === 'ios' ?
				< Header {...this.props} /> :
				(
					<View style={styles.title}>
						{leftView}
						{titleView}
						{rightView}
					</View>
				)

		);
	}

	onTitleLeft = () => {
		this.props.onTitleLeft && this.props.onTitleLeft()
	}

	onTitleRight = () => {
		this.props.onTitleRight && this.props.onTitleRight()
	}

}

const styles = StyleSheet.create({
	title: {
		width: '100%',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: transformSize(100),
		backgroundColor: '#fff'
	},
	titleLeft: {
		position: 'absolute',
		left: transformSize(30),
		width: transformSize(150)
	},
	titleCancel: {
		fontSize: transformSize(30),
		color: commonStyle.color_theme,
		textAlign: 'left'
	},
	titleBack: {
		fontSize: transformSize(32),
		color: '#666',
		textAlign: 'left',
		marginLeft: -4
	},
	titleRight: {
		position: 'absolute',
		right: transformSize(30),
		width: transformSize(90)
	}
});