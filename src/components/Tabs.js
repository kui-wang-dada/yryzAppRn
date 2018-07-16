import React, { Component } from 'react'
import { View, StyleSheet, Text, Platform } from 'react-native'
import { Touchable } from '@components'
import { transformSize } from '@utils'

export default class Tabs extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		let { options, styleTab } = this.props
		return (
			<View style={[s.tabWrap, styleTab]}>
				{options.map(this.renderOption)}
			</View>
		)
	}

	renderOption = (item, index) => {
		let { ViewPageIndex, tabText, tabActiveText } = this.props
		let textStyle = [s.tabText, tabText]
		let optionWrapper = [s.optionWrapper]
		if (index === 0) {
			optionWrapper.push({ marginLeft: 0 })
		}
		if (index === ViewPageIndex) {
			textStyle.push(s.tabActiveText)
			textStyle.push(tabActiveText)
			return (
				<Touchable onPress={this.goToTab(index)} style={optionWrapper} key={index}>
					<Text style={textStyle}>{item}</Text>
					<View style={s.underLine}></View>
				</Touchable>
			)
		} else {
			return (
				<Touchable onPress={this.goToTab(index)} style={optionWrapper} key={index}>
					<Text style={textStyle}>{item}</Text>
				</Touchable>
			)
		}

	}
	goToTab = (index) => () => {
		this.props.goToTab(index)
	}
	componentDidMount() {

	}
}

const s = StyleSheet.create({
	tabWrap: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	optionWrapper: {
		alignItems: 'center',
		marginLeft: transformSize(106)
	},
	tabText: {
		color: "#000",
		fontSize: transformSize(38),
		paddingBottom: transformSize(6)
	},
	tabActiveText: {
		color: "#543dca",

	},
	underLine: {
		width: transformSize(38),
		borderRadius: transformSize(4),
		height: transformSize(7),
		backgroundColor: '#543dca'
	}
})
