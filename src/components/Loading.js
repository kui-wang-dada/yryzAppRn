import React from 'react';
import {
	View,
	Image,
	StyleSheet,
	LayoutAnimation,
	InteractionManager
} from 'react-native';
// import styles from '@styles';
import { commonStyle as styles } from '@utils';
import icon from '@assets/images/logo-placeholder.png';

class Loading extends React.PureComponent {
	state = { loadingImage: false }
	render() {
		return (
			<View style={s.main}>
				{this.state.loadingImage && <Image source={icon} style={s.icon} />}
			</View>
		);
	}
	componentWillMount() {
		this._isMounted = true;
		InteractionManager.runAfterInteractions(() => {
			LayoutAnimation.easeInEaseOut();
			this._isMounted && this.setState({ loadingImage: true });
		});
	}
	componentWillUnmount() {
		this._isMounted = false;
		LayoutAnimation.easeInEaseOut();
	}
}

const s = StyleSheet.create({
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	icon: {
		width: styles.transformSize(478),
		height: styles.transformSize(448),
	}
});

export default Loading;