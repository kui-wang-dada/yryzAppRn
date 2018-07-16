/**
 * 收藏组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
	Button, Icon, Text, StyleSheet, View
} from '@components';
import { http } from '@services';
import { commonStyle } from '@utils';
import { ButtonWithAuth } from '@modules/user';

class Collect extends React.PureComponent {
	constructor(props) {
		super(props);
		this.handlePress = this.handlePress.bind(this);
		this.state = { active: props.active };
	}

	componentDidUpdate(preProps) {
		if (preProps.active !== this.props.active) {
			this.setState({ active: this.props.active })
		}
	}
	render() {
		const vertical = this.props.vertical;
		const style = [].concat(vertical && s.verticalContainer, this.props.style);
		const active = this.state.active;
		const iconStyle = [s.icon].concat(this.props.iconStyle, active && s.activeIcon);
		const textStyle = [s.text].concat(
			vertical && s.verticalText,
			this.props.textStyle,
			active && !this.props.showActiveText && s.activeText,
		);
		const collectText = '收藏';
		const activeText = '已收藏';
		let finalText = this.props.showActiveText && active ? activeText : collectText;
		return (
			<ButtonWithAuth
				transparent
				block
				onPress={this.handlePress}
				style={style}
			>
				<Icon name="collection" style={[iconStyle]} />
				<Text style={textStyle}>{finalText}</Text>
			</ButtonWithAuth>
		);
	}

	handlePress = async () => {
		const { active } = this.state;
		const method = active ? 'DELETE' : 'POST';
		// todo 重复请求
		await http({
			method,
			url: '/services/app/v1/follow/single',
			data: {
				infoId: this.props.id,
				moduleCode: this.props.moduleCode || '1002'
			}
		});
		this.setState({ active: !active });
		this.props.onChange(!active);
	}

	static propTypes = {
		id: PropTypes.number.isRequired,
		active: PropTypes.bool,
		renderText: PropTypes.func,
		onActive: PropTypes.func,
		vertical: PropTypes.bool,
		iconStyle: Text.propTypes.style,
		onDisableActive: PropTypes.func,
	};

	static defaultProps = {
		active: false,
		vertical: true,
	};
}

const defaultColor = '#dbdbdb';
const s = StyleSheet.create({
	verticalContainer: {
		flexDirection: 'column'
	},
	icon: {
		fontSize: commonStyle.transformSize(44),
		color: commonStyle.color_Icon,
	},
	activeIcon: {
		color: '#fe5551',
	},
	text: {
		fontSize: commonStyle.transformSize(44),
		color: '#999',
		marginLeft: commonStyle.transformSize(12)
	},
	activeText: {
		color: '#fe5551'
	},
	verticalText: {
		marginLeft: 0
	},
});

export default Collect;