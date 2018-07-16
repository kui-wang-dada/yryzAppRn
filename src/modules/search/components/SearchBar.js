/**
 *author: AiQingmin
 */
import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Icon, Text, Button, Touchable } from '@components';
import { transformSize, commonStyle } from '@utils';
export default class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
		};
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.searchText !== nextProps.searchText) {
			this.setState({ text: nextProps.searchText });
		}
	}
	render() {
		return (
			<View style={[searchStyle.searchBarWrap, this.props.style]}>
				<Icon name="arrow-left" size={transformSize(36)} style={searchStyle.searchBackIcon} onPress={this.goback} />
				<View style={searchStyle.searchContainerStyle}>
					<Icon name="search" size={transformSize(28)} color={'#bfbfbf'} style={searchStyle.searchIcon} />
					<TextInput
						{...this.props}
						returnKeyType="search"
						onChangeText={this.handleChangeText}
						value={this.state.text}
						onSubmitEditing={this.onSearch}
						style={searchStyle.searchInputStyle}
						placeholderTextColor={'#999999'}
						underlineColorAndroid={'transparent'} />
					<Icon
						name="close-a"
						style={[searchStyle.deleteIcon, this.state.text ? '' : { display: 'none' }]}
						onPress={this.handleDelete} />
				</View>
				<Touchable type="withoutFeedback" onPress={this.onSearch} >
					<View style={searchStyle.searchTxtWrap}>
						<Text style={[searchStyle.searchTxt].concat(this.props.buttonTextStyle)}>搜索</Text>
					</View>
				</Touchable>
			</View>
		);
	}

	handleChangeText = (text) => {
		this.setState({ text });
		this.props.onSearchTxtChange && this.props.onSearchTxtChange(text);
	}

	handleDelete = () => {
		this.setState({ text: '' });
		this.props.onSearchTxtChange && this.props.onSearchTxtChange();
	}

	onSearch = () => {
		this.props.onSearch && this.props.onSearch(this.state.text);
	}

	goback = () => {
		this.props.navigation.goBack();
	}
}
const searchStyle = StyleSheet.create({
	searchBarWrap: {
		flex: 1,
		flexDirection: 'row',
		height: '100%',
		alignItems: 'center',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#eeeeee',
	},
	searchBackIcon: {
		zIndex: 1,
		height: '100%',
		textAlign: 'center',
		textAlignVertical: 'center',
		paddingHorizontal: transformSize(22),
		paddingVertical: transformSize(35),
		includeFontPadding: false,
	},
	searchIcon: {
		zIndex: 1,
	},
	searchContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f4f4f4',
		height: transformSize(60),
		borderRadius: transformSize(10),
		paddingHorizontal: transformSize(16),
	},
	searchInputStyle: {
		flex: 1,
		color: 'black',
		fontSize: transformSize(32),
		textAlignVertical: 'center',
		padding: 0,
		includeFontPadding: false,
		marginLeft: transformSize(12),
	},
	deleteIcon: {
		zIndex: 1,
		fontSize: transformSize(24),
		color: '#bfbfbf',
		padding: transformSize(4),
	},
	searchTxtWrap: {
		paddingHorizontal: transformSize(30),
		paddingVertical: transformSize(26),
		alignItems: 'center',
		justifyContent: 'center',
	},
	searchTxt: {
		alignSelf: 'center',
		color: commonStyle.color_theme,
		fontSize: transformSize(30),
		padding: 0,
		includeFontPadding: false,
	},
});
