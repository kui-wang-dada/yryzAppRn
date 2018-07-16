export const CHOOSE_INTEREST = 'CHOOSE_INTEREST';
export const SKIP_INTEREST = 'SKIP_INTEREST';

export function chooseInterest(payload) {
	return { type: CHOOSE_INTEREST, payload };
}

export function skipInterest() {
	return { type: SKIP_INTEREST };
}
