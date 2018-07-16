　import React, {Component} from 'react';
import {
	View,
	Alert,
	Text,
	Image,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {
	commonStyle,
	transformSize,
} from '@utils';
export default class LoginBigButton extends Component {

	static defaultProps = {
		isLoading: false,
		complete: false,
	}

	renderChildContent() {
		if (this.props.isLoading) {
			return(
				<View style={{'flexDirection': 'row', alignItems: 'center', justifyContent: 'center'}}>
				 <ActivityIndicator
				   animating={true}
				   color='#ffffff'
				   size='small'/>
				 <Text style={[styles.textStyle,{marginLeft: transformSize(20)}]}>
					 {this.props.loginBigButtonText ? this.props.loginBigButtonText : '完成'}
				 </Text>
			   </View>
			);
	   } else {
		   return (
			   <Text style={styles.textStyle}>
				   {this.props.loginBigButtonText ? this.props.loginBigButtonText : '完成'}
			   </Text>
		   );
	   }
	}

	render() {
		return (
			<TouchableOpacity
				 style={[styles.buttonStyle, {backgroundColor: (this.props.complete ? commonStyle.color_login_theme : commonStyle.color_button_unableClick)}]}
				onPress={this.props.clickFinish}
				activeOpacity={0.8}
				disabled={(this.props.isLoading ) ? true :(this.props.complete ? false: true)}>
				{this.renderChildContent()}
			</TouchableOpacity>
		);
	}
}


const styles = StyleSheet.create({
	buttonStyle: {
		// 登录注册底部操作按钮
		flexDirection: 'row',
		width: commonStyle.SCREEN_WIDTH * 0.76,
		height: transformSize(80),
		marginTop: transformSize(80),
		marginLeft: transformSize(94),
		marginRight: transformSize(94),
		backgroundColor: commonStyle.color_button_unableClick,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 50,
	},
	textStyle: {
		fontSize: transformSize(32),
		color: '#ffffff'
	}
});
