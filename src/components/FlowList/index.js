import React from 'react';
import PropTypes from 'prop-types';
import {
	View, FlatList, ActivityIndicator,
	RefreshControl, Animated, Text
} from 'react-native';

import { http } from '@services';
import { cache } from '@utils';
import { PullFlatList } from 'react-native-rk-pull-to-refresh'
import Message from '../Message';
import EndTip from './EndTip';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class FlowList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
			data: [],
			pageNo: 1,
			noMoreData: false,
			hasLoadData: false,

		};
	}
	static propTypes = {
		emptyNode: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
		])
	};
	static defaultProps = {
		fetchData: null,
		pageSize: 20,
		disabledPage: false,
		cacheFirstPage: false,
		disabledRefresh: false,
		onEndReachedThreshold: 0.9,
		showsVerticalScrollIndicator: false,
		emptyComponent: (<Message preset="no-data"></Message>),
		renderItem: ({ item }) => {

			return (<View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}><Text>没有定义renderItem</Text></View>)
		}
	}

	componentDidMount() {

		this._isMounted = true;
		this.handleRefresh({ refreshing: false });
	}
	componentWillUnmount() {
		this._isMounted = false;

	}
	updateData(data) {
		// item更新无法渲染问题
		if (data.length !== this.state.data.length) {
			this.setState({
				data: [].concat(data),
			});
		} else {
			this.setState({
				data: [].concat(data),
				extraData: { newkey: new Date() }
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.request !== this.props.request) {
			this.handleRefresh();
		}
		return false;
	}
	_parseRes = (res) => {
		if (!res)
			return [];
		if (Array.isArray(res))
			return res;
		let data = res.data.data;
		if (data === null)
			return [];
		if (Array.isArray(data.data))
			return data.data;
		if (Array.isArray(data.entities))
			return data.entities;
		if (Array.isArray(data))
			return data;
		console.warn('数据无法识别', data);

	}

	_afterFetchData = (res, cacheType) => {
		let results = this._parseRes(res);
		let { data } = this.state;
		let { pageSize, disabledPage, onFetchedData } = this.props;
		let { pageNo } = this.state;
		if (pageNo === 1) {
			data = results;
		} else {
			data = [...data, ...results];
		}
		let noMoreData = disabledPage || results.length === 0 || pageSize > results.length;
		if (cacheType !== 'fromcache') {
			pageNo++;
			this.isLoading = false;
		}

		this._isMounted && this.setState({
			data,
			refreshing: false,
			pageNo,
			noMoreData,
			hasLoadData: true
		}, () => {
			this.finishRefresh()
			onFetchedData && onFetchedData(data, res);

		});

	}
	_fetchData = async () => {
		if (this.isLoading)
			return;
		this.isLoading = true;
		let { request, pageSize, disabledPage, cacheFirstPage } = this.props;
		let { data, refreshing, pageNo, noMoreData } = this.state;
		if (!request) {
			this.setState({ refreshing: false });
			this.isLoading = false;
			return;
		}
		if (typeof request === 'function') {
			request = request(pageNo, pageSize);
		} else {
			if (typeof request === 'string') {
				request = { url: request };
			}

			if (!disabledPage) {
				request = { ...request, url: `${request.url}/${pageNo}/${pageSize}` }
			}
		}
		try {
			if (cacheFirstPage && pageNo === 1) {
				await cache(request, this._afterFetchData);
			} else {
				let res = await http(request);
				this._afterFetchData(res);
			}

		} catch (res) {
			this.isLoading = false;
			this._isMounted && this.setState({ refreshing: false, noMoreData: true, hasLoadData: true }, () => {
				this.finishRefresh()
			});
		}
	}

	handleRefresh = () => {
		if (this.isLoading)
			return;
		let newState = {
			refreshing: true,
			pageNo: 1,
			noMoreData: false
		};
		this._timetick = new Date();

		this.setState(newState, () => {
			this.startRefresh()
			this._fetchData();
		});
		this.props.onRefresh && this.props.onRefresh();
	}

	handleLoadMore = () => {
		if (this.isLoading)
			return;
		if (!this.state.noMoreData)
			this._fetchData();
	}
	keyExtractor = (item, i) => {
		return this._timetick + i;
	}
	setNativeProps(props) {
		this._root.setNativeProps(props);
	}
	finishRefresh = () => {
		this._root && this._root.finishRefresh && this._root.finishRefresh();
	}
	startRefresh = () => {
		this._root && this._root.startRefresh && this._root.startRefresh();
	}
	// onEndReachedThreshold 没有作用，自行根据可见元素的变化加载更多
	handleViewableItemsChanged = (e) => {
		let { viewableItems = [] } = e;
		if (viewableItems.length === 0) return;
		let lastVisibleItem = viewableItems[viewableItems.length - 1];
		if (lastVisibleItem.index + this.props.pageSize / 2 > this.state.data.length) {
			this.handleLoadMore();
		}
	}

	render() {
		let { data, refreshing, extraData } = this.state;
		let { fetchData, pageSize, disabledRefresh, onRefresh,
			cacheFirstPage, useAnimated, request, ...otherProps } = this.props;
		if (!request && this.props.data) {
			data = this.props.data
		}
		let FlatListComponent = useAnimated ? AnimatedFlatList : FlatList;
		// let FlatListComponent = useAnimated ? AnimatedFlatList : PullFlatList
		return (<FlatListComponent

			{...otherProps}
			onPullRelease={this.handleRefresh}
			isContentScroll={true}
			ref={(e) => this._root = e}
			data={data}
			extraData={extraData}
			keyExtractor={this.keyExtractor}
			ListFooterComponent={this.renderListFooterComponent()}
			onEndReached={this.handleLoadMore}
			onViewableItemsChanged={this.handleViewableItemsChanged}
			refreshing={refreshing}
			refreshControl={this.renderRefreshControl()}
		/>);
	}
	renderRefreshControl = () => {
		if (this.props.disabledRefresh) {
			return null;
		}
		let { refreshControlOptions = { title: "下拉获取更多内容" } } = this.props;
		let { refreshing } = this.state;

		return (<RefreshControl
			{...refreshControlOptions}
			refreshing={refreshing}
			onRefresh={this.handleRefresh}
		/>);
	};
	renderListFooterComponent = () => {
		let { noMoreData, hasLoadData, data } = this.state;
		let { request, emptyComponent } = this.props;
		if (!request || !hasLoadData)
			return null;
		if (data.length === 0) {
			return emptyComponent;
		}

		return (<EndTip visible={noMoreData} />)
	}


}



export default FlowList;
