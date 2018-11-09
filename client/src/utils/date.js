import { isBefore, isEqual, addHours, addDays, parse } from 'date-fns'

export const DATE_RANGE_OPTIONS = {
	'past_day': 'Past 24 Hours',
	'past_week': 'Past 7 Days',
	'past_month': 'Past 30 Days',
}

export function getDateRange(range_name) {
	const now = new Date()
	let start
	if (range_name === 'past_day') {
		start = addHours(now, -24)
	} else if (range_name === 'past_week') {
		start = addDays(now, -7)
	} else if (range_name === 'past_month') {
		start = addDays(now, -30)
	}
	return {
		start,
		end: now
	}
}

export function ISOtoDate(ISODate) {
	return parse(ISODate)
}

/** Return true if two datetimes are on the same date, regardless of time */
export function sameDate(date1, date2) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

/** Return true if two datetimes are on the same hour, regardless of minutes */
export function sameHour(date1, date2) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate() &&
		date1.getHours() === date2.getHours()
	)
}

/**
 * Generate a list of Date objects starting at startDate, ending at endDate,
 * and separated by a tick
 */
export function filledDateRange(startDate, endDate, tick='day') {
	const addTick = tick === 'hour' ? t => addHours(t, 1) : t => addDays(t, 1)
	const returnRange = []

	let cursorDate = startDate
	while (isBefore(cursorDate, endDate) || isEqual(cursorDate, endDate)) {
		returnRange.push(cursorDate)
		cursorDate = addTick(cursorDate)
	}

	return returnRange
}
