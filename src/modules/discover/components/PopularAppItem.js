import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { transformNum, transformSize, textSecondaryColor } from '@utils';
import { Icon, Image } from '@components'
export default class PopularAppItem extends Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	static defaultProps = {
		data: null
	}

	render() {
		let { data } = this.props
		let { appliIcon, appliName, appliClassify, slog, id } = data
		if (data) {
			return (
				<TouchableOpacity onPress={() => this.goToDetail(id)}>
					<View style={[s.wrapper, this.props.style]}>
						<Image style={s.icon} source={{ uri: appliIcon }}></Image>
						<View style={s.contentWrapper}>
							<Text style={s.title} numberOfLines={1} >{appliName}</Text>
							<Text style={s.label} numberOfLines={1}>{appliClassify}</Text>
							<Text style={s.desc} numberOfLines={1}>{slog}</Text>
						</View>
					</View>
				</TouchableOpacity>
			);
		} else {
			return (<View />)
		}
	}

	componentDidMount() {

	}

	goToDetail(id) {
		this.props.navigation.navigate('AppDetail', { id: id });
	}

}

const s = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		marginTop: transformSize(60),
	},
	icon: {
		borderRadius: transformSize(32),
		marginRight: transformSize(22),
		width: transformSize(146),
		height: transformSize(146),
		borderColor: '#cccccc',
		borderWidth: StyleSheet.hairlineWidth,
		overflow: 'hidden'
	},
	contentWrapper: {
		flex: 1,
		justifyContent: 'space-between',
		height: transformSize(146),
	},
	title: {
		fontSize: transformSize(36),
		fontWeight: 'bold',
		overflow: 'hidden',
		color: '#000',
		padding: 0,
		includeFontPadding: false,

	},
	label: {
		fontSize: transformSize(26),
		overflow: 'hidden',
		color: textSecondaryColor,
		padding: 0,
		includeFontPadding: false,
	},
	desc: {
		fontSize: transformSize(30),
		overflow: 'hidden',
		color: textSecondaryColor,
		padding: 0,
		includeFontPadding: false,
	},
});