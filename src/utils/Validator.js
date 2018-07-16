import {
	NavigationActions
} from 'react-navigation'
import store from '../../store'


function isNumber(value) {
	return !Number.isNaN(Number(value));
}

class Validator {
	/**
	 * @constructor
	 * @param {Object} rules 每一个字段的规则。键为字段名，值为规则数组。
	 */
	constructor(rules) {
		this.initRules(rules);
	}

	/**
	 * 把传入的规则存入实例属性。
	 *
	 * @param rules 参见 constructor。
	 */
	initRules(rules) {
		for (let fieldName in rules) {
			this.rules[fieldName] = rules[fieldName].map((rule) => {
				// 如果规则只是个字符串，转为标准的结构。
				if (typeof rule === 'string') {
					rule = {
						rule
					};
				}

				let ruleName = rule.rule;

				if (ruleName) {
					if (this.builtinRules.hasOwnProperty(ruleName)) {
						return Object.assign({}, this.builtinRules[ruleName], rule);
					}

					throw new Error(`"${ruleName}" doesn't exist in built-in rules.`);
				}

				return rule;
			});
		}
	}

	/**
	 * 验证。
	 *
	 * @return 验证结果。参见 handleResult。
	 */
	validate(...args) {
		let result = null;

		if (Array.isArray(args[0])) {
			for (let field of args[0]) {
				let fieldResult = this.validateOne(field);
				result = fieldResult;

				if (!result.success) {
					break;
				}
			}
		} else {
			result = this.validateOne(...args);
		}

		return this.handleResult(result);
	}

	/**
	 * 验证单个字段。
	 *
	 * @return {Object} 单个字段的验证结果。
	 */
	validateOne(...args) {
		if (typeof args[0] === 'object') {
			let {
				name,
				value
			} = args[0];
			return this.validateOne(name, value);
		}

		let [
			name,
			value
		] = args;
		let fieldRules = this.rules[name];

		if (!fieldRules) {
			throw new Error(`Validation rule for "${name}" required.`);
		}

		let result = {
			success: true
		};

		for (let rule of fieldRules) {
			// 如果值为空，规则却不是 required，则跳过。
			if (rule.rule !== 'required' && !this.test(value, this.builtinRules['required'].test)) {
				continue;
			}

			if (!this.test(value, rule.test)) {
				Object.assign(result, {
					success: false,
					message: rule.message
				});
				break;
			}
		}

		return result;
	}

	/**
	 * 用某条规则测试一个值。
	 *
	 * @param value 值。
	 * @param {RegExp | Function} test 测试规则。
	 * @return {Boolean} 是否测试通过。
	 */
	test(value, test) {
		let passed = false;

		if (test instanceof RegExp) {
			passed = test.test(value);
		} else if (typeof test === 'function') {
			passed = test(value);
		} else {
			throw new Error(`${test} is not a valid test.`);
		}

		return passed;
	}

	/**
	 * 处理验证结果，以暴露不同的 API。
	 *
	 * @param result 单个字段的验证结果。参见 validateOne。
	 * @return {Promise | Undefined} 验证通过，返回一个 resolved 的 Promise；验证失败，弹出提示，无返回值。
	 */
	handleResult(result) {
		if (result.success) {
			return Promise.resolve();
		} else {
			alert(result.message);
			return Promise.reject();
		}
	}

	get builtinRules() {
		return {
			'required': {
				test(value) {
					return !!value.trim();
				},

				message: '请完整填写'
			},
			'mobile': {
				test: /^1[3578]\d{9}$/,
				message: '请填写合法的手机号'
			},
			'number': {
				test(value) {
					return isNumber(value);
				},

				message: '请填写数字类型'
			},
			'mobile-code': {
				test(value) {
					return isNumber(value) && value.length === 4;
				},

				message: '请填写 4 位数字验证码'
			}
		};
	}

	rules = {};
}

export default Validator;