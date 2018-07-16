import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, FlatList, Image, Text, Icon, Message } from '@components';
import { connect } from 'react-redux';
import { transformSize, commonStyle, cache } from '@utils';
import moment from 'moment';
import * as AnnounceAction from './message.action';

let mapStateToProps = (state) => {
	return {
		announceData: state.announce
	}
}
@connect(mapStateToProps)
export default class AnnounceScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	static navigationOptions = {
		title: '系统公告'
	}

	componentDidMount() {
		this.requestData();
	}

	renderItem = ({ item, index }) => {
		return (
			<View style={styles.item}>
				<View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: transformSize(30) }, styles.itemMargin]}>
					{item.hasRead ? null : (<View style={styles.itemRedDot} />)}
					<Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
				</View>
				<Text numberOfLines={3} style={[styles.itemContent, styles.itemMargin]}>{item.content}</Text>
				<View style={[styles.line, styles.itemMargin]} />
				<View style={[{ flex: 1, flexDirection: 'row', paddingBottom: transformSize(30) }, styles.itemMargin]}>
					<Text style={styles.time}>{this.getAnnounceTime(item.lastUpdateDate)}</Text>
					<TouchableOpacity style={styles.itemDetail} onPress={() => this.toDetail(item)}>
						<Text >查看详情</Text>
						<Icon name='arrow-right' color='#666' style={{ fontSize: transformSize(26), marginLeft: transformSize(10) }} />
					</TouchableOpacity>
				</View>
				<View style={{ width: '100%', height: transformSize(30), backgroundColor: '#eee' }} />
			</View >
		);
	}

	render() {
		let { announceData } = this.props
		return (
			<View style={styles.container}>
				{announceData.length === 0 ?
					(<Message preset="no-data" style={styles.empty} />) :
					(<FlatList
						data={announceData}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index}>
					</FlatList>)
				}
			</View>
		);
	}

	requestData = () => {
		cache(`/services/app/v1/notice/list/1/1000000`, (response) => {
			if (response.data.code === '200') {
				if (response.data.data) {
					let _resData = response.data.data.entities;
					let _entities = _resData;
					_entities.forEach(function (item) {
						item.checkBOx = true;
					});
					this.props.dispatch({ type: AnnounceAction.LOAD_ANNOUNCE, payload: _entities });
				}
			}
		});
	}

	getAnnounceTime = (time) => {
		if (time) {
			return moment(time).format('MM-DD');
		} else {
			return ''
		}
	}

	toDetail = (item) => {
		const newData = this.props.announceData.map((value, index) => {
			if (item.id === value.id) {
				value.hasRead = true;
			}
			return value;
		})
		this.props.dispatch({ type: AnnounceAction.DELETE_ANNOUNCE, payload: newData })
		this.props.navigation.navigate('AnnounceDetail', item.id)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		flexDirection: 'column'
	},
	item: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#FFFFFF'
	},
	itemMargin: {
		marginHorizontal: transformSize(40),
	},
	itemRow: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row'
	},
	itemTitle: {
		fontSize: transformSize(34),
		color: '#333'
	},
	itemRedDot: {
		width: transformSize(18),
		height: transformSize(18),
		marginRight: transformSize(10),
		borderRadius: transformSize(12),
		backgroundColor: '#f00'
	},
	itemContent: {
		flex: 1,
		marginTop: transformSize(5),
		fontSize: transformSize(28),
		color: '#666'
	},
	itemTime: {
		position: 'absolute',
		left: 0,
		fontSize: transformSize(30),
		color: '#666'
	},
	itemDetail: {
		position: 'absolute',
		right: 0,
		flexDirection: 'row',
		alignItems: 'center'
	},
	line: {
		marginTop: transformSize(20),
		marginBottom: transformSize(20),
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#eaeaea'
	}
});