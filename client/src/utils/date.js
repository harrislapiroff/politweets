import { DateTime } from 'luxon'

export const DATE_RANGE_OPTIONS = {
	'past_day': 'Past 24 Hours',
	'past_week': 'Past 7 Days',
	'past_month': 'Past 30 Days',
}

export function getDateRange(range_name) {
	const now = DateTime.local()
	let start
	if (range_name === 'past_day') {
		start = now.minus({ hours: 24 })
	} else if (range_name === 'past_week') {
		start = now.minus({ days: 7 })
	} else if (range_name === 'past_month') {
		start = now.minus({ days: 30 })
	}
	return {
		start,
		end: now
	}
}
