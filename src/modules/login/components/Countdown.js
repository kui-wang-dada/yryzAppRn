import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet
} from 'react-native';
import {
	Text
} from '@components';

class Countdown extends React.Component {
	render() {
		return (
			<Text style={[style.main, this.props.style]}>{this.state.rest}</Text>
		);
	}

	start() {
		this.timer = setInterval(this.step, 1000);
	}

	end() {
		clearInterval(this.timer);

		if (this.props.onEnd) {
			this.props.onEnd();
		}
	}

	componentDidMount() {
		this.start();
	}

	step = () => {
		const newRest = this.state.rest - 1;

		if (newRest > 0) {
			this.setState((state) => ({
				rest: newRest
			}));
		} else {
			this.end();
		}
	};

	state = {
		rest: this.props.beginning
	};

	timer = null;

	static propTypes = {
		beginning: PropTypes.number.isRequired,
		onEnd: PropTypes.func
	};
}

const style = StyleSheet.create({
	main: {
		textAlign: 'center'
	}
});

export default Countdown;