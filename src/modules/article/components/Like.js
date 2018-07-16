/**
 * 点赞
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, Touchable, Icon, StyleSheet } from '@components';
import {
	http
} from '@services';
import { commonStyle, transformNum } from '@utils';

class Like extends React.PureComponent {
	constructor(props) {
		super(props);
		this.handlePress = this.handlePress.bind(this);
	}

	render() {
		const vertical = this.props.vertical;
		const style = [].concat(!vertical && s.horizontalContainer, this.props.style);
		const active = this.props.active;
		const iconStyle = [s.icon].concat(this.props.iconStyle, active && s.activeIcon);
		const count = transformNum(this.props.count);
		const text = this.props.renderText ? this.props.renderText(count) : count === 0 ? null : count;
		const textStyle = [s.text].concat(
			vertical && s.verticalText,
			this.props.textStyle,
			active && this.props.activeText && s.activeText
		);
		return (
			<Touchable transparent onPress={this.handlePress} style={style}>
				<Icon name="good" style={iconStyle} />
				<Text style={textStyle}>{text}</Text>
			</Touchable>
		);
	}

	handlePress() {
		const { active } = this.props;
		const method = active ? 'DELETE' : 'POST';

		this.do(method);
	}

	do = async (method) => {
		const data = (await http({
			method,
			url: '/services/app/v1/like/single',
			data: {
				moduleCode: this.props.moduleCode,
				infoId: this.props.id
			}
		})).data.data;
		this.props.onChangeLike && this.props.onChangeLike(!this.props.active, this.props.id);
	}

	static propTypes = {
		id: PropTypes.number.isRequired,
		count: PropTypes.number,
		active: PropTypes.bool,
		moduleCode: PropTypes.string.isRequired,
		renderText: PropTypes.func,
		onChangeLike: PropTypes.func,
		vertical: PropTypes.bool,
		iconStyle: Text.propTypes.style
	};

	static defaultProps = {
		active: false,
		vertical: false
	};
}

const defaultColor = '#dbdbdb';
const s = StyleSheet.create({
	horizontalContainer: {
		flexDirection: 'row'
	},
	icon: {
		fontSize: commonStyle.transformSize(30),
		color: defaultColor
	},
	activeIcon: {
		color: '#fa4d5d',
	},
	text: {
		fontSize: commonStyle.transformSize(24),
		color: defaultColor,
		marginLeft: commonStyle.transformSize(9)
	},
	verticalText: {
		marginLeft: 0
	},
	activeText: {
		color: '#fa4d5d',
	}
});

export default Like;