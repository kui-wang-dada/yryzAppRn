import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
export default class HighLight extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	static defaultProps = {
		search: '',
		text: ''
	}

	render() {
		return (
			<Text {...this.props}>
				{this.renderText()}
			</Text>
		);
	}

	renderText() {
		let search = this.props.search;
		let text = this.props.text;
		let tb
		if (search) {
			let textArr = text.split(search);
			tb = textArr.map((item, index) => {
				return (
					<Text style={[style.highlight, this.props.activeStyle]} key={index}>
						{index === 0 ? '' : search}
						<Text style={[style.normal, this.props.style]}>{item}</Text>
					</Text>
				);
			});
		} else {
			tb = <Text style={[style.normal, this.props.style]}> {text}</Text >
		}


		return tb;
	}
}
const style = StyleSheet.create({
	highlight: {
		padding: 0,
		includeFontPadding: false,
		color: 'red'
	},
	normal: {
		color: 'black',
		padding: 0,
		includeFontPadding: false,
	}
});
