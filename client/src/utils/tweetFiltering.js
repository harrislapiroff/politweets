import { isBefore, isAfter } from 'date-fns'

export function tweetsBetweenDates(tweets, startDate, endDate) {
	return tweets.filter(t => isBefore(t.time, endDate) && isAfter(t.time, startDate))
}
