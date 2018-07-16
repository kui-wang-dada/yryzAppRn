import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { transformNum, transformSize, textSecondaryColor } from '@utils';
import { Icon, ImageBackground } from '@components'
import {
	HomeItemHor,
	HomeItemVer,
	HomeItemVideo,
} from '@modules/home/components'
export default class InterestingNew extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { data } = this.props;
		if (data.contentFlag) {
			console.log('HomeItemVideo');
			return (
				<HomeItemVideo goToDetail={this.props.goToDetail} data={data} />
			)
		}

		if (!data.contentFlag && !data.coverImgType) {
			console.log('HomeItemVer');
			return (
				<HomeItemVer goToDetail={this.props.goToDetail} data={data} />
			)
		}

		if (!data.contentFlag && data.coverImgType) {
			console.log('HomeItemHor');
			return (
				<HomeItemHor goToDetail={this.props.goToDetail} data={data} />
			)
		}

	}
}