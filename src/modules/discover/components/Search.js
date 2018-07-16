import React, { Component } from 'react';
import { Image, StyleSheet, Touchable, Text, View, Icon } from '@components';
import { transformSize } from '@utils';
import { http } from '@services';
import { connect } from 'react-redux';
import {
	loadHotWords
} from '../discover.action';

let mapStateToProps = (state) => {
	return {
		hotWords: state.discover.hotWords,
	};
};

@connect(mapStateToProps)
export default class DiscoverHeader extends Component {

	render() {
		let { hotWords = '请输入关键字' } = this.props;
		return (
			<Touchable type="withoutFeedback" onPress={this.gotoSearch} >
				<View style={headerStyle.searchBarWrap} >
					<View style={headerStyle.searchInput}>
						<Icon name="search" style={headerStyle.searchIcon} />
						<Text style={headerStyle.hotword}>{hotWords}</Text>
					</View>
				</View>
			</Touchable>
		);
	}

	gotoSearch = () => {
		let { hotWords } = this.props;
		this.props.navigation.navigate('SearchScreen', { hotWords });
	}

	componentDidMount() {
		this.fetchHotWords();
	}

	fetchHotWords = async () => {
		let res = await http('/services/app/v1/hotword/list');
		let hotWordsArr = res.data.data;
		let hotWords = hotWordsArr && hotWordsArr[0].hotword;
		return this.props.dispatch(loadHotWords({ hotWords: hotWords }));
	}

}

const headerStyle = StyleSheet.create({
	searchBarWrap: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		paddingHorizontal: transformSize(40),
	},
	searchInput: {
		flexDirection: 'row',
		height: transformSize(64),
		borderRadius: transformSize(10),
		backgroundColor: '#f4f4f4',
		overflow: 'hidden',
		paddingHorizontal: transformSize(20),
		alignItems: 'center',
	},
	searchIcon: {
		fontSize: transformSize(24),
		height: transformSize(24),
		color: '#999',
	},
	hotword: {
		fontSize: transformSize(32),
		color: '#999',
		marginLeft: transformSize(10),
		alignSelf: 'center',
	},
});