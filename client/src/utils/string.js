export const NBSP = '\xa0'

export function pad(value, count=2, padCharacter='0') {
	// Ensure values are strings
	let stringValue = String(value)
	let stringPad = String(padCharacter)
	while (stringValue.length < count) {
		stringValue = stringPad + stringValue
	}
	return stringValue
}

export function capitalize(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function pluralize(value, number, pluralization='s') {
	if (number === 1) {
		return value
	} else {
		return value + pluralization
	}
}
