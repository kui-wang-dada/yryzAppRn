import React from 'react';
import PropTypes from 'prop-types';
import { Image, Tag, Touchable, ViewPropTypes, StyleSheet, Text, View } from '@components';
import { navigation } from '@services';
import { commonStyle } from '@utils';
import { profilePlaceholder } from '@assets';
class Author extends React.PureComponent {
	constructor(...args) {
		super(...args);
		this.goToUser = this.goToUser.bind(this);
	}

	render() {
		const label = this.props.label ? <Tag style={s.label}>{this.props.label}</Tag> : null;
		let time = this.props.time;
		time = time && time.replace(/:\d{2}$/, '');
		const timeNode = time ? <Text style={[s.time].concat(this.props.timeStyle)}>{time}</Text> : null;
		const block = this.props.block;
		const style = [s.container].concat(
			block && s.containerInTouchable,
			this.props.style,
			!time && s.containerMiddle
		);

		return (
			<Touchable type="highlight" disabled={!block} onPress={this.goToUser}>
				<View style={style}>
					<Touchable
						type="highlight"
						disabled={block}
						onPress={this.goToUser}
						style={[s.avatarTouchable].concat(this.props.avatarTouchableStyle)}
					>
						<Image
							loadingIndicatorSource={profilePlaceholder}
							source={{ uri: this.props.avatar }}
							style={[s.avatar].concat(this.props.avatarStyle)}
						/>
					</Touchable>
					<View>
						<View style={s.identity}>
							<Text onPress={block ? null : this.goToUser} style={[s.name].concat(this.props.nameStyle)}>{this.props.name}</Text>
							{label}
						</View>
						{timeNode}
					</View>
				</View>
			</Touchable>
		);
	}

	goToUser() {
		if (!this.props.id) {
			return;
		}
		navigation.navigate('Profile', {
			id: this.props.id,
			type: ({
				'user': 1,
				'writer': 0
			})[this.props.type]
		});
	}

	static propTypes = {
		id: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]),
		avatar: PropTypes.string,
		name: PropTypes.string,
		time: PropTypes.string,
		block: PropTypes.bool,
		type: PropTypes.oneOf([
			'user',
			'writer'
		]),
		avatarTouchableStyle: ViewPropTypes.style,
		nameStyle: Text.propTypes.style
	};

	static defaultProps = {
		block: false,
		type: 'user',
		avatar: profilePlaceholder,
	};
}

const avatarSize = commonStyle.transformSize(74);
const avatarBorderRadius = avatarSize / 2;
const s = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	containerMiddle: {
		alignItems: 'center'
	},
	containerInTouchable: {
		backgroundColor: 'white'
	},
	avatarTouchable: {
		borderRadius: avatarBorderRadius,
		marginRight: commonStyle.transformSize(18),
		overflow: 'hidden',
	},
	avatar: {
		width: avatarSize,
		height: avatarSize,
		borderRadius: avatarBorderRadius,
	},
	identity: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	name: {
		fontSize: commonStyle.transformSize(28)
	},
	label: {
		fontSize: commonStyle.transformSize(24),
		paddingVertical: commonStyle.transformSize(8),
		paddingHorizontal: commonStyle.transformSize(20),
		marginLeft: commonStyle.transformSize(18)
	},
	time: {
		fontSize: commonStyle.transformSize(24),
		color: '#999',
		marginTop: commonStyle.transformSize(4)
	}
});

export default Author;