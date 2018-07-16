import React from 'react';
import {
	StyleSheet
} from 'react-native';
import {
	View
} from './';
import { commonStyle as styles } from '@utils';

class TagGroup extends React.Component {
	render() {
		const tags = React.Children.map(this.props.children, (child) => child ? React.cloneElement(child, {
			style: [style.tag].concat(child.props.style)
		}) : null);
		return <View style={[style.tagGroup, this.props.style]}>{tags}</View>;
	}
}

const style = StyleSheet.create({
	tagGroup: {
		flexDirection: 'row'
	},
	tag: {
		marginRight: styles.transformSize(16),
		marginBottom: styles.transformSize(16),
	}
});

export default TagGroup;
