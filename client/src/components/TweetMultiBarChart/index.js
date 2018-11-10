import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import { filledDateRange, ISOtoDate, sameDate, sameHour } from '~/utils/date.js'
import { category } from '~/utils/prop-types.js'

import BarChartRow from './BarChartRow.js'
import {
	ROW_HEIGHT,
	ROW_GUTTER,
	CHART_WIDTH,
	TWEET_NODE_WIDTH,
	TWEET_NODE_GUTTER,
	BAR_MAX_WIDTH,
} from './measurements.js'

import './index.sass'

export default class TweetMultiBarChart extends Component {

	constructor () {
		super()
		this.state = {
			selectedRowIndex: null,
		}
	}

	handleSelectRow(i) {
		this.setState({ selectedRowIndex: i })
	}

	render () {
		const {
			tweets,
			startDate,
			endDate,
			categories,
			tick,
		} = this.props

		const {
			selectedRowIndex
		} = this.state

		const domainTicks = filledDateRange(startDate, endDate, tick)

		/* Munge data into an array of this form:
		 *
		 * [
		 *   {
		 *     date: Date(2018, 11, 7, 2, 0),
		 *     label: 'Mon 9',
		 *     tweetsByCategory: { category1: [...tweets...], category2: [... tweets ...] }
		 *   ),
		 *   ...
		 * ]
		 */
		const dataRows = domainTicks.map((t, idx) => {
			// Calculate an appropriate label
			let label
			if (tick === 'hour') {
				// If the time is midnight or this is the first row of the chart
				// include a day of the week in the label
				label = ((t.getHours() === 0) || (idx === 0)) ? format(t, 'ddd hA') : format(t, 'hA')
			} else {
				// If the date is the first or this is the first row of the chart
				// include a day of the week in the label
				label = ((t.getDate() === 1) || (idx === 0)) ? format(t, 'MMM D dd') : format(t, 'D dd')
			}

			// Compare dates appropriately for the tick
			const cmpDates = tick === 'hour' ? sameHour : sameDate
			// Get the tweets that belong in this tick row
			const tweetsForTick = tweets.filter(tweet => cmpDates(ISOtoDate(tweet.time), t))
			// Filter into an object sorted by category
			const tweetsByCategory = categories.reduce(
				(acc, cat) => Object.assign(
					acc, { [cat.key]: tweetsForTick.filter(cat.tweetFilterFn) }
				), {}
			)

			return {
				date: t,
				label,
				tweetsByCategory
			}
		})

		// Calculate the maximum value of the range, for layout purposes
		const allCounts = dataRows.reduce((accumulator, dataPoint) => {
			const counts = categories.map(category => {
				return dataPoint.tweetsByCategory[category.key].length
			})
			return accumulator.concat(counts)
		}, [])
		const maxRange = Math.max(...allCounts)


		let nodeWidth = TWEET_NODE_WIDTH
		let nodeGutter = TWEET_NODE_GUTTER
		if (maxRange * (TWEET_NODE_WIDTH + TWEET_NODE_GUTTER) > BAR_MAX_WIDTH) {
			// If there are enough tweets in the maximum row that they'll overflow, make
			// each tweet node smaller
			nodeWidth = ((BAR_MAX_WIDTH + TWEET_NODE_GUTTER) / maxRange) - TWEET_NODE_GUTTER
		}
		if (maxRange > BAR_MAX_WIDTH / 3) {
			// If there are *really* a lot of tweets, get rid of the gutter
			nodeWidth = BAR_MAX_WIDTH / maxRange
			nodeGutter = 0
		}

		const chartHeight = domainTicks.length * (ROW_HEIGHT + ROW_GUTTER)

		return (
			<svg
				className="bar-chart"
				width={CHART_WIDTH}
				height={chartHeight}
				viewBox={`0 0 ${CHART_WIDTH} ${domainTicks.length * ROW_HEIGHT}`}
				preserveAspectRatio="xMidYMin meet"
				onMouseOut={() => this.handleSelectRow(null)}
			>
				{dataRows.map((d, i) => (
						<BarChartRow
							key={i}
							label={d.label}
							tweetsByCategory={d.tweetsByCategory}
							y={i * (ROW_HEIGHT + ROW_GUTTER)}
							nodeWidth={nodeWidth}
							nodeGutter={nodeGutter}
							rowGutter={ROW_GUTTER}
							active={selectedRowIndex === null || selectedRowIndex === i}
							onMouseOver={() => this.handleSelectRow(i)}
						/>
				))}
			</svg>
		)
	}
}

TweetMultiBarChart.propTypes = {
	tweets: PropTypes.array.isRequired,
	startDate: PropTypes.instanceOf(Date).isRequired,
	endDate: PropTypes.instanceOf(Date).isRequired,
	categories: PropTypes.arrayOf(PropTypes.shape(category)),
	tick: PropTypes.oneOf(['hour', 'day']).isRequired,
}
