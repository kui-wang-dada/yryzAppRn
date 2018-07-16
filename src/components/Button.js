import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Button as ElementsButton } from 'react-native-elements'
import PropTypes from 'prop-types';
import { transformSize } from '@utils'
import {Icon} from '@components';
export default class HomeHeader extends Component {
	constructor(props) {
		super(props);
	}

	renderIcon() {
		const icon = this.props.icon
		const iconColor = this.props.iconColor
		if (icon) {
			return (
				<Icon name={icon} disabled={true} style={{color: iconColor, marginRight: transformSize(20)}}/>
			)
		} else {
			return null
		}
	}

	static defaultProps = {
		textStyle: {
			fontSize: transformSize(32),
			color: '#ffffff',
			marginVertical: 0,
		}
	}

	render() {
		const iconColor = this.props.iconColor
		const title = this.props.title
		const style = this.props.style
		return (
			<TouchableOpacity
				{...this.props}
				style={[styles.main,style]}
				onPress={this.props.onPress}
				activeOpacity={0.8}>
				{this.renderIcon()}
				<Text style={this.props.textStyle}>
				   {title}
				</Text>
			</TouchableOpacity>
		);
	}

	componentDidMount() {

	}

	renderMask() {
		const maskStyle = [
			style.mask,
			{
				opacity: this.state.pressing ? 0.1 : 0
			}
		];

		return <View style={maskStyle} />;
	}

	handlePressIn() {
		this.setState({
			pressing: true
		});

	}

	handlePressOut() {
		this.setState({
			pressing: false
		});
	}

	state = {
		pressing: false
	};
}

propTypes = {
	icon: PropTypes.String,
	onPress: PropTypes.func,
	title: PropTypes.String,
	style: PropTypes.StyleSheet
}

const styles = StyleSheet.create({
	main: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	}
});
