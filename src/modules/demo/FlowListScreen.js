import React from 'react';
import { View, Text } from 'react-native'
import { FlowList } from '@components'
import { commonStyle } from '@utils'
export default class extends React.Component {
	navigationOptions = { title: 'FlowListDemo' }
	render() {
		return (<View style={{ flex: 1 }}>

			<FlowList
				request={{ url: '/services/app/v1/application/classify/1' }}
			/></View>)
	}

}