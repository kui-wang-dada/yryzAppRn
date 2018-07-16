export const LOAD_HOTWORDS = 'LOAD_HOTWORDS';

export function loadHotWords(payload) {
	return { type: LOAD_HOTWORDS, payload };
}