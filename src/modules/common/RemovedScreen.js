import React from 'react';
import { commonStyle } from '@utils';
import {
	Text,
	StyleSheet,
	Message,
	View,
} from '@components'
import { noData } from '@assets';

export default class RemovedScreen extends React.Component {
	constructor(props) {
		super(props);
	}
	static navigationOptions = ({ navigation }) => {
		let title = navigation.getParam('title');
		return {
			headerTitle: <Text style={styles.titleTxt}>{title}</Text>,
			headerStyle: {
				borderBottomWidth: StyleSheet.hairlineWidth,
				elevation: 0,
				borderBottomColor: "#e5e5e5",
			}
		};
	}
	render() {
		return (
			<View style={styles.container}>
				<Message image={noData} content="您访问的内容可能被删除" />
			</View>
		)
	}

	componentDidMount() {
		let { params = {} } = this.props.navigation.state;
		this.title = params.title || '下架';
		this.props.navigation.setParams({ 'title': this.title });
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		height: commonStyle.SCREEN_HEIGHT,
	},
	titleTxt: {
		fontSize: commonStyle.transformSize(34),
		fontWeight: 'bold',
		flex: 1,
		paddingHorizontal: commonStyle.transformSize(100),
		textAlign: 'center',
		color: '#000',
	}
})