"use strict";

import React, { Component } from 'react';
import {
    View,
    Alert,
    Text,
    TouchableOpacity
} from 'react-native';
import {
	transformSize,
	commonStyle
} from '@utils';
export default class CountDownButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timerCount: this.props.timerCount || 60,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        };
        // this._shouldStartCountting = this._shouldStartCountting.bind(this)
        // this._countDownAction = this._countDownAction.bind(this)
    }

    countDownAction = () => {

        const codeTime = this.state.timerCount;
        const now = Date.now()
        const overTimeStamp = now + codeTime * 1000 + 100/*过期时间戳（毫秒） +100 毫秒容错*/
        this.interval = setInterval(() => {
            /* 切换到后台不受影响*/
            const nowStamp = Date.now()
            if (nowStamp >= overTimeStamp) {
                /* 倒计时结束*/
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: this.props.timerTitle || '获取验证码',
                    counting: false,
                    selfEnable: true
                })
                if (this.props.timerEnd) {
                    this.props.timerEnd()
                };
            } else {
                const leftTime = parseInt((overTimeStamp - nowStamp) / 1000, 10)
                this.setState({
                    timerCount: leftTime,
                    timerTitle: `重新获取(${leftTime}s)`,
                })
            }
        }, 1000)
    }

    shouldStartCountting = (shouldStart) => {
        if (this.state.counting) { return }
        if (shouldStart) {
            this.countDownAction()
            this.setState({
                counting: true,
                selfEnable: false,
                timerTitle: `重新获取(${this.props.timerCount}s)`,
            })
        } else {
            this.setState({ selfEnable: true })
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        //onClick 父组件中点击后调用的函数，根据返回的boolean值处理是否开始倒计时，
        const { onClick, btnStyle,textStyle, enable, disableColor,enableColor } = this.props
        const { counting, timerTitle, selfEnable } = this.state
        return (
            <TouchableOpacity activeOpacity={counting ? 1 : 0.8} onPress={() => {
                if (!counting && enable && selfEnable) {
                    this.props.onClick(this.shouldStartCountting);
                };
            }} style = {btnStyle}>
                <Text
                    style={[{ fontSize: transformSize(30) },
                        textStyle, { color: ((!counting && enable && selfEnable) ? (enableColor ? enableColor : 'blue') : disableColor || 'gray') }]}>
                        {timerTitle}
                </Text>
            </TouchableOpacity>
        )
    }
}
