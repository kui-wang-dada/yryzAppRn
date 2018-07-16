import React from 'react';
import {
	Modal,
	StyleSheet,
	Animated,
	FlatList
} from 'react-native';
import {
	View,
	Button,
	Text,
	Touchable
} from '@components';
import { commonStyle as styles, modal } from '@utils';

export default class ActionSheet extends React.Component {
	render() {

		return (


			<FlatList
				data={this.state.options}
				renderItem={this.renderItem}
				bounces={false}
				keyExtractor={this.extractKey}
				ItemSeparatorComponent={this.renderItemSeparator}
			/>




		);
	}

	renderItem = ({ item, index }) => {

		if (index === this.props.options.length - 1) {

		}
		return (
			<Button
				transparent
				onPress={this.handlePressItem(index)}
				style={s.item}
				title={item}
				textStyle={s.itemText}

			/>


		);
	};

	renderItemSeparator = (data) => {
		let itemSeparator = [s.itemSeparator]
		let { options } = this.props
		if (data.leadingItem === options[1]) {
			itemSeparator.push(s.bigSeparator)
		}
		return <View style={itemSeparator} />;
	}


	extractKey = (item, index) => index.toString();




	handlePressItem = (index) => () => {
		modal.close();

		if (this.props.callback) {
			this.props.callback(index);
		}
	};

	state = {
		options: this.props.options,
	};


}

const s = StyleSheet.create({
	item: {
		backgroundColor: 'white',
		borderRadius: 0,
		height: styles.transformSize(100)
	},
	itemText: {
		color: 'black',
		fontSize: styles.transformSize(32)
	},
	itemSeparator: {
		height: styles.transformSize(1),
		backgroundColor: "#eee"
	},
	bigSeparator: {
		height: styles.transformSize(12),
		backgroundColor: "#eee"
	}
});

