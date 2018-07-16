import React, { Component } from 'react'
import { View, Text, FlowList } from '@components';
import AppItem from './components/AppItem';

export default class extends Component {

	state = {
		url: `/services/app/v1/application/tag/${this.props.navigation.state.params.tagId}`
	};

	static navigationOptions = ({ navigation }) => {
		let { labelName } = navigation.state.params;
		return {
			headerTitle: labelName,
			headerTitleStyle: {
				flex: 1,
				textAlign: 'center'
			},
			headerRight: <View />
		};
	}

	render() {
		return (
			<FlowList
				request={this.state.url}
				renderItem={({ item }) => <AppItem data={item} tagPress={this.tagPress.bind(this)} />}
			/>
		);
	}

	tagPress(label) {
		this.props.navigation.setParams({ labelName: label.labelName });
		this.setState({
			url: `/services/app/v1/application/tag/${label.id}`
		})
	}

}