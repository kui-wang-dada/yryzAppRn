
// 弹出层的调用方法
// 当前仅涉及到YModal
let instance = null;
export default {
	setInstance(ref) {
		instance = ref;
	},

	show(component, type, forceUse) {
		instance.show(component, type, forceUse)
	},
	close() {
		instance.close()
	}
};
