import React, { Component } from 'react';
import {
	ImageBackground, ART,
	Animated,
	findNodeHandle,
	Platform, SafeAreaView, DeviceEventEmitter, InteractionManager, UIManager, TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const { Surface, Shape, Path } = ART;
import { StyleSheet, ScrollView, View, Tag, TagGroup, Panel, Image, Icon, Touchable, FlowList, Text, Share, Toast } from '@components';
import { transformSize, cache, circle, umengTrack, modal, env } from '@utils';

export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: { y: 0, height: 0 },
			shake: new Animated.Value(7)
		};
	}

	renderCircleGraph(node, even, shake) {
		return (
			<View style={decorate.circle}>
				{/* {
					node.checkJump === 0 && !even ?
						<Animated.Image source={require('./../assets/pk-press-right.png')}
							style={[decorate.handIcon, decorate.handRight, {
								transform: [{ translateX: shake }]
							}]} />
						: null
				} */}
				<Image source={{ uri: node.nodeImg1 }}
					// roundAsCircle={true}
					style={decorate.circleGraph} />
				{/* {
					node.checkJump === 0 && even ?
						<Animated.Image source={require('./../assets/pk-press-left.png')} style={[decorate.handIcon, decorate.handLeft, {
							transform: [{ translateX: shake }]
						}]} />
						: null
				} */}
			</View>
		)
	}


	renderStep(node, even, index) {
		let direction = even ? decorate.stepLeft : decorate.stepRight;
		let step = [decorate.step].concat([direction]);
		return (
			<View style={step}>
				<LinearGradient
					colors={['#9a6ce5', '#8c5cf7']}
					start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} locations={[0, 1]}
					style={decorate.stepTag}
				>
					<Text style={decorate.stepName} numberOfLines={1}>{index + 1}  {node.nodeTitle}</Text>
				</LinearGradient>
				<Text style={decorate.slogn}>{node.nodeDesc}</Text>
			</View >
		);
	}

	componentDidMount() {
		this.shake(10);
	}

	shake(value) {
		let shake = value === -7 ? 7 : -7;
		Animated.timing(this.state.shake, {
			toValue: shake,
			duration: 400
		}).start(() => {
			this.shake(shake);
		});
	}

	setLayout = (layout) => {
		console.log('layout item', layout)
		this.setState({ layout })
	}

	render() {
		let { node, index, onPress, scrollY, total } = this.props;
		// 取当前组件设置的layout属性值
		let { y, height } = this.state.layout
		let even = index % 2 === 0;
		let transformScale = null;
		if (height) {
			console.log('item layout', this.state.layout)
			let interpolateScale = scrollY.interpolate({
				inputRange: [y - height / 3, y, y + height / 4],
				outputRange: [0.7, 1, 0.7],
				extrapolate: 'clamp',
			})
			transformScale = { transform: [{ scale: interpolateScale }] }
		}

		return (
			<Touchable
				onPress={onPress.bind(null, node, index)}
				key={index}
				ref={ref => this._root = ref}
				activeOpacity={node.checkJump === 1 ? 1 : 0.5} >
				<Animated.View
					style={[decorate.contaienr, transformScale
					]
					}>
					<View style={even ? [decorate.offsetItem, decorate.offsetLeft] : [decorate.offsetItem, decorate.offsetRight]}>
						{this.renderCircleGraph(node, even)}
						{this.renderStep(node, even, index)}
					</View >
					{

						node.checkJump === 0 && !even ?
							<Animated.Image source={require('./../assets/pk-press-right.png')}
								style={[decorate.handIcon, decorate.handRight, { transform: [{ translateX: this.state.shake }] }]} />
							: null

					}
					{
						node.checkJump === 0 && even ?
							<Animated.Image
								source={require('./../assets/pk-press-left.png')}
								style={[decorate.handIcon, decorate.handLeft, { transform: [{ translateX: this.state.shake }] }]} />
							: null
					}
				</Animated.View>
				{
					index < total - 1 ?
						this.ItemSeparatorComponent(index)
						: null
				}
			</Touchable >
		);
	}


	// 行与行之间的分隔线组件。不会出现在第一行之前和最后一行之后
	ItemSeparatorComponent(index) {
		let uri = index % 2 ? require('./../assets/line-up.png') : require('./../assets/line-down.png');
		return (
			<View style={decorate.linkLineBox}>
				<Image source={uri} style={decorate.linkLine} />
			</View>
		);
	}


}


const decorate = StyleSheet.create({
	contaienr: {
		position: 'relative',
	},
	offsetItem: {
		width: transformSize(400 * 1.2),
		alignItems: 'center'
	},
	step: {
		width: '100%',
		marginTop: transformSize(-20)
	},
	stepTag: {
		width: '100%',
		alignItems: 'center',
		paddingVertical: transformSize(12),
		paddingHorizontal: transformSize(22),
		borderRadius: transformSize(35),
		borderWidth: transformSize(3),
		marginBottom: transformSize(22),
		overflow: 'hidden',
		borderColor: 'white'
	},
	circle: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	stepLeft: {
		// marginLeft: transformSize(40),
	},
	stepRight: {
		// alignSelf: 'flex-end'
	},
	offsetLeft: {
		marginLeft: transformSize(40),

	},
	offsetRight: {
		marginRight: transformSize(40),
		alignSelf: 'flex-end'
	},
	circleGraph: {
		width: transformSize(350 * 1.2),
		height: transformSize(350 * 1.2),
		borderRadius: transformSize(175 * 1.2),
		overflow: 'hidden'
	},
	slogn: {
		includeFontPadding: false,
		alignSelf: 'center',
		fontSize: transformSize(28),
		lineHeight: transformSize(40),
		color: 'black'
	},
	stepName: {
		includeFontPadding: false,
		fontSize: transformSize(36),
		color: 'white'
	},
	handIcon: {
		position: 'absolute',
		zIndex: 99,
		width: transformSize(68),
		height: transformSize(44),

	},
	handLeft: {
		top: transformSize(165),
		marginLeft: transformSize(55),
		right: transformSize(50)
	},
	handRight: {
		top: transformSize(165),
		marginRight: transformSize(55),
		left: transformSize(50)
	},
	linkLineBox: {
		paddingVertical: transformSize(36),
		alignItems: 'center'
	},
	linkLine: {
		width: transformSize(245),
		height: transformSize(79)
	},
});