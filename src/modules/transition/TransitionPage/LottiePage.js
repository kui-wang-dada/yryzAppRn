import React from 'react';
import Animation from 'lottie-react-native';
import { Common } from 'ydk-react-native';
import { View, Platform, InteractionManager } from 'react-native';

export default class LottiePage extends React.Component {

	componentDidMount() {
	}

	play = () => {
		InteractionManager.runAfterInteractions(() => {
			this.animation.play();
		});
	}


	render() {
		let imageAssetsFolder = Platform.OS === 'android' ? 'images/' : undefined;

		return (
			<View style={this.props.style}>
				<Animation
					ref={animation => { this.animation = animation; }}
					imageAssetsFolder={imageAssetsFolder}
					loop={false}
					{...this.props}
					loop={false}
				/>
			</View>
		);
	}
}
