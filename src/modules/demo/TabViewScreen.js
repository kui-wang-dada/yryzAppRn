import React from 'react';
import { View, Text } from 'react-native'
import { FlowList, TabView } from '@components'
import { commonStyle } from '@utils'
export default class extends React.Component {
	navigationOptions = { title: 'FlowListDemo' }
	render() {
		return (<TabView style={{ flex: 1 }}>

			<FlowList tabLabel="tab1"
				request={{ url: '/services/app/v1/application/classify/1' }}
			/>
			<FlowList tabLabel="aaaaaaa"
				request={{ url: '/services/app/v1/application/classify/1' }}
			/>
			<FlowList tabLabel="a"
				request={{ url: '/services/app/v1/application/classify/1' }}
			/>
			<FlowList tabLabel="aa"
				request={{ url: '/services/app/v1/application/classify/1' }}
			/>
		</TabView>)
	}

}