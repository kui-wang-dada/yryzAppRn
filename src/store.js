import React, { Component } from 'react';

import { combineReducers, createStore } from "redux";
import { Provider } from 'react-redux';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import { loadModule, getAppReducers } from './services/modules';
import modules from './modules';
loadModule(modules)
let reducers = getAppReducers();
const persistConfig = {
	key: 'root',
	storage,

}
const persistedReducer = persistReducer(persistConfig, combineReducers(reducers));
let store = createStore(persistedReducer);

export class StoreProvider extends Component {

	constructor(props) {
		super(props);
	}
	state = { persistIsFinish: false }
	componentWillMount() {
		persistStore(store, {}, () => {
			this.setState({ persistIsFinish: true })
		});
	}
	render() {
		if (!this.state.persistIsFinish)
			return null;
		return <Provider store={store}>{this.props.children}</Provider>;
	}
}


export default store;