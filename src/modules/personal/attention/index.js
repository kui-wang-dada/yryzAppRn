import attention from './attention.reducer'
import MyAttentionScreen from './MyAttentionScreen'
let routes = {
	MyAttention: {
		screen: MyAttentionScreen
	}
}

let reducers = {
	attention
}
export { routes, reducers }