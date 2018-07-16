import React, {Component} from 'react';
import {
    View,
    TextInput,
    Image,
    Text,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet
} from 'react-native'
import PropTypes from 'prop-types';
import {Button} from '@components'
import head from '@assets/images/update.png';
import {transformSize, commonStyle} from '@utils';

export default class UpdateModal extends Component {

    static defaultProps = {
        forceUpdate: true
    }

    constructor(props) {
        super(props);
        this.onComfirm = this.onComfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onComfirm() {
        this.props.onUpdate();
    }

    onCancel() {
        this.props.hideModal(); // 关闭Modal
    }


    renderNotUpdate() {
        if (this.props.forceUpdate) {
            return null
        } else {
            return (
                <TouchableOpacity onPress={this.onCancel}>
                    <Text style={styles.cancelTitlte}>以后再说</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        const { updateContent } = this.props;
        return (
            <View style={styles.background}>
            <Image source={head} style={styles.head}/>
            <View style={styles.content}>
                <Text style={styles.contentText} >{updateContent}</Text>
            </View>
            <Button onPress={this.onComfirm} style={styles.updateButton} title='立即升级'/>
            {this.renderNotUpdate()}
        </View>)
    }
}

propTypes = {
    forceUpdate: PropTypes.Bool,  //是否需要强制更新
    hideModal: PropTypes.func,  //隐藏modal
    onUpdate: PropTypes.func,   //确定更新
    updateContent: PropTypes.String, //更新内容
}

const styles = StyleSheet.create({
    // modalBackground: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0,0,0,0.5)'
    // },
    background: {
        backgroundColor: 'white',
        borderRadius: transformSize(40),
        flexDirection: 'column',
        width: '74%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    head: {
        width: '100%',
        height: transformSize(250),
    },
    content: {
        marginTop: transformSize(30),
        marginHorizontal: transformSize(44),
        marginBottom: transformSize(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentText: {
        fontSize: commonStyle.fontSize_content_summary_28,
        color:'black'
    },
    updateButton: {
        marginBottom: transformSize(40),
        backgroundColor: commonStyle.color_theme,
        height: transformSize(60),
        borderRadius: transformSize(60),
        width: transformSize(315)
    },
    cancelTitlte: {
        fontSize: commonStyle.fontSize_content_summary_28,
        color: commonStyle.fontColor_assist_2,
        marginBottom: transformSize(40),
        height: transformSize(30)
    }
})
