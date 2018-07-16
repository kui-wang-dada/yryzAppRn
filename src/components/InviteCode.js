import React from 'react';
import signStyles from "../../screens/login/styles";
import {http} from "../../services";
import {View, Item, Input} from "../";


export default class InviteCode extends React.Component {
	render() {
		return (
			this.state.inviteFlag
				?
				<Item>
					<Input
						placeholder="邀请码（选填）"
						returnKeyType="next"
						clearButtonMode="always"
						value={this.props.inviteCode}
						onChangeText={this.handleFieldChange('inviteCode')}
						style={signStyles.input}
					/>
				</Item>
				:
				null
		);
	}
	componentDidMount() {
		this.fetchInviteFlag();
	}
    handleFieldChange = (fieldName) => (value) => {
    	this.props.handleFieldChange(fieldName, value);
    };
    fetchInviteFlag = async () => {
    	this.setState({
    		inviteFlag: (await http('/services/app/v1/new/invite/checkOnInvite')).data.data.inviteFlag
    	});
    }
    state = {
    	inviteFlag: true,
    };

}
