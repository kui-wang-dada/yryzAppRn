import React, { Component } from 'react';
import {View, TextInput,StyleSheet,Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {
    commonStyle,
    transformSize,
} from '@utils'

export default class TextInputString extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        style: PropTypes.style,
    }

    render() {
        return (
            <View style={[this.props.style, styles.container]}>
                <TextInput {...this.props}
                           style={styles.phoneInput}
                           numberOfLines = {1}
                           selectionColor={commonStyle.color_theme}
                           clearButtonMode='while-editing'
                           placeholderTextColor={commonStyle.fontColor_assist_content}
                           disableFullscreenUI={true}
                           underlineColorAndroid="transparent"
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
		alignItems: 'center',
		borderRadius: transformSize(80),
		backgroundColor: commonStyle.color_textinput,
		height: transformSize(80),
		width: commonStyle.SCREEN_WIDTH * 0.76,
    },

    phoneInput:{
        flex: 1,
		textAlign: 'left',
		height: transformSize(80),
        fontSize: commonStyle.fontSize_login_30,
		marginLeft: transformSize(40),
        marginRight: transformSize(25),
		width: commonStyle.SCREEN_WIDTH * 0.76,
    },
})
