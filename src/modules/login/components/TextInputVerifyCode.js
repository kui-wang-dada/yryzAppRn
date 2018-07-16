import React, {Component} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {commonStyles} from "../styles";
import CountDownButton from '../components/CountDownButton';
import PropTypes from 'prop-types';
import {
    commonStyle,
    transformSize,
} from '@utils'

export default class TextInputVerifyCode extends Component {
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
                           style={styles.Input}
                           numberOfLines={1}
                           selectionColor={commonStyle.color_theme}
                           placeholderTextColor={commonStyle.fontColor_assist_content}
                           disableFullscreenUI={true}
                           disabled={this.props.isLoading}
                           clearButtonMode='while-editing'
                           underlineColorAndroid="transparent"
                           maxLength={4}
                           keyboardType='numeric'
                />
                <CountDownButton
                    {...this.props}
                    enable={!this.props.isLoading} btnStyle={styles.sendVerifyCodeBtnStyle} textStyle={styles.btnTextStyle}
                    enableColor='#543dca' disableColor='#543dca'
                    timerCount={60}
                    timerTitle={'获取验证码'}
                    timerActiveTitle={['请在（', 's）后重试']}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: transformSize(50),
		borderRadius: transformSize(80),
		backgroundColor: commonStyle.color_textinput,
		height: transformSize(80),
		width: commonStyle.SCREEN_WIDTH * 0.76,
    },
    btnTextStyle: {
        fontSize: commonStyle.fontSize_content_summary_28,
        alignItems: 'center',
        color: 'white',
    },
    Input: {
        flex: 1,
		alignSelf: 'flex-start',
        fontSize: commonStyle.fontSize_login_30,
		backgroundColor: commonStyle.color_textinput,
		textAlign: 'left',
		marginLeft: transformSize(44),
		marginRight: transformSize(10),
		height: transformSize(80),
    },
    sendVerifyCodeBtnStyle: {
        //发送验证码按钮
        height: transformSize(80),
        marginTop: 0,
        marginBottom: 0,
        marginRight: transformSize(44),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    }
})
