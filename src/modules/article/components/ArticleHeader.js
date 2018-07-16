
import React from 'react';
import { View, Text, StyleSheet } from '@components';
import PropTypes from 'prop-types';
import { commonStyle } from '@utils';
import Author from './Author';
import Follow from './Follow';

export default class AricleHeader extends React.Component {
	static propTypes = {
		data: PropTypes.object,
		showHeaderTop: PropTypes.bool,
	};

	static defaultProps = {
		showHeaderTop: false
	};
	render() {
		const article = this.props.data || {};
		let { showHeaderTop } = this.props;

		let { author = {}, title } = article;
		let { followFlag, headImg, id, nickName, type } = author;
		// only writer
		let bodyComponent = id && type === 0 ? (
			<View style={style.writerBlock}>
				<Author name={nickName} avatar={headImg} id={id} type={'writer'} avatarStyle={style.avatarWrap} nameStyle={style.authorName} />
				<Follow style={style.headerAttentionBtn}
					active={followFlag === 1}
					id={parseInt(id)}
					onChange={this.props.onFollowed}
					activeStyle={style.followedStyle}
				/>
			</View>
		) : <Text numberOfLines={1} style={style.titleTxt}>{title}</Text>;



		return showHeaderTop ? bodyComponent : null;
	}
}


const style = StyleSheet.create({
	writerBlock: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
		// width: commonStyle.transformSize(900)
	},
	avatarWrap: {
		width: commonStyle.transformSize(54),
		height: commonStyle.transformSize(54),
	},
	headerAttentionBtn: {
		height: commonStyle.transformSize(48),
		justifyContent: 'center',
		alignSelf: 'center',
	},
	followedStyle: {
		backgroundColor: '#d7d7d7',
	},
	titleTxt: {
		fontSize: commonStyle.transformSize(34),
		color: '#000',
		// fontWeight: 'bold',
		textAlign: 'center',
		flex: 1,
	},
	authorName: {
		color: '#000',
	}
});