/**
 * 关注（作者, App）组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from '@components';
import { ButtonWithAuth } from '@modules/user';
import {
	http,
} from '@services';
import { commonStyle } from '@utils';

class Follow extends React.PureComponent {
	constructor(...args) {
		super(...args);
		this.toggle = this.toggle.bind(this);
	}

	render() {
		let style = [
			s.main,
			this.props.style,
		];
		let text = this.props.followText || '关注';
		let textStyle = [
			s.text,
			this.props.textStyle
		];

		if (this.props.active) {
			style = [
				s.main,
				s.active,
				this.props.style,
				this.props.activeStyle,
			];
			text = '已关注';
			textStyle = [
				s.text,
				s.activeText,
				this.props.textStyle,
				this.props.activeTextStyle,
			];
		}

		return (
			<ButtonWithAuth disabled={this.state.disabled} onPress={this.toggle} style={style}>
				<Text style={textStyle}>{text}</Text>
			</ButtonWithAuth>
		);
	}
	async toggle() {
		this.setState({
			disabled: true
		});

		const active = this.props.active;
		const method = active ? 'DELETE' : 'POST';
		try {
			await http({
				method,
				url: '/services/app/v1/follow/single',
				data: {
					infoId: this.props.id,
					moduleCode: this.props.moduleCode || '1004'
				}
			});
			this.props.onChange(!active);
		} catch (error) {
			console.error('request for follow failed', error);
		} finally {
			this.setState({
				disabled: false
			});
		}
	}

	state = {
		disabled: false
	};

	static propTypes = {
		id: PropTypes.number.isRequired,
		active: PropTypes.bool,
		onChange: PropTypes.func,
		style: PropTypes.any,
		activeStyle: PropTypes.any,
		textStyle: PropTypes.any,
		followText: PropTypes.any,
	};

	static defaultProps = {
		active: false
	};
}

const s = StyleSheet.create({
	main: {
		paddingHorizontal: commonStyle.transformSize(24),
		backgroundColor: '#fe5551',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: commonStyle.transformSize(24),
	},
	text: {
		fontSize: commonStyle.transformSize(28),
		color: '#fff',
	},
	activeText: {
		color: '#999',
	}
});

export default Follow;