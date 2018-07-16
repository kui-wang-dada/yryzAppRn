export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_EDIT = 'SIGN_EDIT';

export function signIn(payload) {
	return { type: SIGN_IN, payload };
}
export function signOut() {
	return { type: SIGN_OUT };
}
export function signEdit(payload) {
	return { type: SIGN_EDIT, payload };
}