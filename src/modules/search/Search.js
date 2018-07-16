import React, { Component } from 'react';
import { StyleSheet, TabView, FlowList, Keyboard, View } from '@components';
import { connect } from 'react-redux';
import { http } from '@services';
import { cache, transformSize } from '@utils';
import SearchBar from './components/SearchBar'
import HotSearch from './SearchHot';
import SearchHistory from './SearchHistory';
import searchTab from './searchTab';
import { addHistory } from './search.action';
@connect()
export default class SearchScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showHistory: false,
			showHot: true,
		};
	}

	static navigationOptions = ({ navigation, screenProps }) => {
		let { params } = navigation.state
		return {
			headerLeft: null,
			headerRight: null,
			headerTitle:
				(<SearchBar
					navigation={navigation}
					onSearch={(keyWord) => params.handleSearch(keyWord)}
					placeholder={params.wordsHolder}
					onFocus={() => params.focusSearch()}
					onBlur={() => params.blurSearch()}
					searchText={params.keyWords}
					onSearchTxtChange={(text) => params.handleSearchTxtChange(text)} />),
			headerStyle: {
				height: transformSize(108),
				backgroundColor: '#fff',
				borderBottomWidth: 0,
				elevation: 0,
			}
		}
	}

	render() {
		return (
			<View style={searchStyle.wrapper}>
				{this.renderBody()}
			</View>
		);
	}

	renderBody = () => {
		if (this.state.showHistory) {
			return <SearchHistory onHistoryPress={this.pressHistory} />;
		}
		if (this.state.showHot) {
			return <HotSearch {...this.props} onHotWordPress={this.handleSearch} />;
		}
		return (this.renderTabs());
	}

	componentDidMount() {
		if (this.props.navigation.state.params) {
			const keyword = this.props.navigation.state.params.keyword;

			if (keyword) {
				this.handleSearch(keyword);
			}
		}

		this.props.navigation.setParams({
			handleSearch: this.handleSearch,
			focusSearch: this.focusSearch,
			blurSearch: this.blurSearch,
			handleSearchTxtChange: this.handleSearchTxtChange,
		})

		cache('/services/app/v1/hotword/list', (res) => {
			let _res = res.data.data;
			let wordsHolder = _res && _res[0].hotword;
			this.props.navigation.setParams({
				wordsHolder: wordsHolder
			})
		});
	}

	handleSearchTxtChange = (text) => {
		if (!text) {
			this.setState({ showHot: true, showHistory: false });
			this.props.navigation.setParams({
				keyWords: ''
			})
		} else {
			this.setState({ showHot: false, showHistory: true });
		}
	}

	pressHistory = (item) => {
		this.setState({ showHistory: false, showHot: false });
		this.props.navigation.setParams({
			keyWords: item
		})
	}

	focusSearch = () => {
		this.setState({ showHistory: true });
	}

	blurSearch = () => {
		this.setState({ showHistory: false }, Keyboard.dismiss());
	}

	handleSearch = (words) => {
		let { wordsHolder = '', keyWords = '' } = this.props.navigation.state.params;
		words = words.trim() !== '' ? words : wordsHolder;
		if (words === keyWords) {
			return;
		}
		this.saveHotword(words);
		this.setState({ showHot: false, showHistory: false });
		this.props.navigation.setParams({
			keyWords: words
		})
	}

	// 保存新增关键字
	saveHotword = (hotword) => {
		this.props.dispatch(addHistory({ keyword: hotword }));
		http({
			url: `/services/app/v1/hotword/addUserSearchword/${hotword}`,
			method: 'put'
		}).then((res) => {
			if (res.data.code !== '200') {
				console.warn('save hotword failed ', hotword);
			}
		});
	}

	renderTabs = () => {
		let { keyWords } = this.props.navigation.state.params;
		if (!keyWords)
			return null;
		return (
			<TabView style={searchStyle.tabBars}>
				{searchTab.map(this.renderTab)}
			</TabView>
		);
	}

	renderTab = (catItem) => {
		let { keyWords } = this.props.navigation.state.params;
		return (
			<catItem.tabComp navigation={this.props.navigation} tabLabel={catItem.cat} key={catItem.cat} keyWords={keyWords} />
		);
	}
}

const searchStyle = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: 'white'
	},
	nav: {
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	tabBars: {
		flex: 1,
	},
	tabWrap: {
		paddingTop: transformSize(48),
		paddingBottom: transformSize(22),
	}
});
