let instance = null;
const share = {
	init(element) {
		instance = element;
	},

	open(data) {
		instance.setState({
			data
		});
		instance.open();
	}
};

export default share;