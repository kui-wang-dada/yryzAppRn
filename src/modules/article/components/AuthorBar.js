/**
 * 文章用户栏（作者信息，创作时间，关注按钮）
 */
import React, { Component } from 'react';
import { View, StyleSheet } from '@components';
import Author from './Author';
import Follow from './Follow';
import { commonStyle } from '@utils';

class AuthorBar extends Component {
	render() {
		let { author = {}, startTime } = this.props.data;
		let { followFlag, headImg, id, nickName, publishDate, type } = author;

		let element = null;
		// :0 写手,1 悠然一指用户,2 运营人员
		if (type === 0) {
			element = (
				<View style={style.writerBlock} collapsable={false}>
					<Author name={nickName} avatar={headImg} time={startTime} id={id} type={'writer'} nameStyle={style.authorName} />
					<Follow style={style.attentionBtn} activeStyle={style.followedStyle}
						active={followFlag === 1} id={parseInt(id)}
						onChange={this.props.onFollowed}
					/>
				</View>
			);
		} else if (type === 1) {
			element = (
				<View style={style.writerBlock}>
					<Author name={nickName} avatar={headImg} time={startTime} id={id} type={'user'} nameStyle={style.authorName} />
				</View>
			);
		}
		return (
			<View collapsable={false}>
				{element}
			</View>
		)
	}
}
export default AuthorBar;

const style = StyleSheet.create({
	writerBlock: {
		// height: commonStyle.transformSize(124),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
		marginTop: commonStyle.transformSize(46),
		marginBottom: commonStyle.transformSize(30),
	},
	attentionBtn: {
		height: commonStyle.transformSize(48),
		justifyContent: 'center',
		alignSelf: 'center',
	},
	followedStyle: {
		backgroundColor: '#d7d7d7',
	},
	authorName: {
		color: '#000',
	}
});