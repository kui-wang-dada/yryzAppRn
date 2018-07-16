
import React from 'react';
import { View, Text, StyleSheet, Image } from '@components';
import PropTypes from 'prop-types';
import { commonStyle } from '@utils';

export default class AppHeader extends React.Component {
	static propTypes = {
		data: PropTypes.object,
		showHeaderTop: PropTypes.bool,
	};

	static defaultProps = {
		showHeaderTop: false
	};
	render() {
		const { appliName, appliIcon } = this.props.data || {};
		let { showHeaderTop } = this.props;
		let bodyComponent = (
			<View style={[style.titleWrap, !showHeaderTop && style.hide]}>
				<Image source={{ uri: appliIcon }} style={style.headerIcon} />
				<Text numberOfLines={1} style={style.titleTxt}>{appliName}</Text>
			</View>
		);
		return bodyComponent;
	}
}


const style = StyleSheet.create({
	titleWrap: {
		flexDirection: 'row',
		flex: 1,
		...commonStyle.centerWrap,
	},
	headerIcon: {
		width: commonStyle.transformSize(50),
		height: commonStyle.transformSize(50),
		borderRadius: commonStyle.transformSize(10),
		overlayColor: '#fff',
	},
	titleTxt: {
		fontSize: commonStyle.transformSize(32),
		marginLeft: commonStyle.transformSize(18),
		color: '#333',
	},
	hide: {
		display: 'none',
	}
});