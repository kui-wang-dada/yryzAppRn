import React from 'react';
import { View, ScrollView } from '@components';
import { StyleSheet } from 'react-native';
import { http } from '@services'
import { ArticleBody } from '@modules/article';

export default class AnnounceDetailScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}

	static navigationOptions = {
		title: '公告详情'
	}

	componentDidMount() {
		this.requestData();
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={{ flex: 1 }}>
					<ArticleBody
						title={this.state.data.title}
						content={this.state.data.content}
						onRouteChange={this.onRouteChange} />
				</ScrollView>
			</View>);
	}

	onRouteChange = (callBack) => { }

	requestData = async () => {
		let res = await http(`/services/app/v1/notice/getNotice/${this.props.navigation.state.params}`);
		let data = res.data;
		if (data.code === '200') {
			this.setState({ data: data.data });
		}
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		flexDirection: 'column',
		justifyContent: 'center'
	},
})