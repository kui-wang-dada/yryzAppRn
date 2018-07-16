import React from 'react';
import { FormInput } from 'react-native-elements';
// import { placeholderColor } from '@styles';
const InputWarp = (props) => {
	return <FormInput
		// placeholderTextColor={placeholderColor}
		{...props}></FormInput>;
};
export default InputWarp