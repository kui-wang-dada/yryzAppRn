import React, { Component } from 'react';
import { StyleSheet, View, Text, Touchable, Icon, Keyboard } from '@components';
import { connect } from 'react-redux';
import { transformSize } from '@utils';
import { deleteHistory } from './search.action';

let mapStateToProps = (state) => {
	return {
		history: state.search.history,
	};
};
@connect(mapStateToProps)
export default class SearchHistory extends Component {

	render() {
		let { history } = this.props;
		if (!history) {
			return null;
		}
		return (
			<Touchable style={style.container} onPress={this.touchEmpty}>
				{history.slice(0, 5).map(this.renderItem)}
			</Touchable>
		);
	}

	renderItem = (item, index) => {
		return (
			<View style={style.itemWrap} key={index}>
				<Touchable style={style.touchWrap} onPress={this.handleHistoryPress(item)}>
					<Icon name="clock" style={style.clock} />
					<Text style={style.textWrap}>{item}</Text>
				</Touchable>
				<Touchable type="withoutFeedback" onPress={this.deleteHistory(item)}>
					<Icon name="delete" style={style.iconWrap} />
				</Touchable>
			</View>
		);
	}

	touchEmpty = () => {
		Keyboard.dismiss();
	}

	deleteHistory = (item) => () => {
		this.props.dispatch(deleteHistory({ keyword: item }));
	}

	handleHistoryPress = (item) => () => {
		this.props.onHistoryPress && this.props.onHistoryPress(item);
		Keyboard.dismiss();
	}
}

const style = StyleSheet.create({
	container: {
		paddingHorizontal: transformSize(40),
		backgroundColor: '#fff',
		flex: 1,
	},
	clock: {
		fontSize: transformSize(26),
		color: '#dddddd',
		alignSelf: 'center',
	},
	itemWrap: {
		flexDirection: 'row',
		height: transformSize(86),
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#eeeeee'
	},
	touchWrap: {
		flex: 1,
		flexDirection: 'row',
	},
	textWrap: {
		flex: 1,
		marginLeft: transformSize(20),
		alignSelf: 'center',
		fontSize: transformSize(26),
		color: '#666666',
	},
	iconWrap: {
		fontSize: transformSize(30),
		color: '#dddddd',
		alignSelf: 'center',
	}
});