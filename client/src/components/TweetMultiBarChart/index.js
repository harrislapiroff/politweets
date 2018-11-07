import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import { filledDateRange, ISOtoDate, sameDate, sameHour } from '~/utils/date.js'

import BarChartRow from './BarChartRow.js'
import {
	ROW_HEIGHT,
	CHART_WIDTH,
	ROW_GUTTER,
} from './measurements.js'

import './index.sass'

export default function TweetMultiBarChart({
	data,
	startDate,
	endDate,
	tick,
}) {
	const domainTicks = filledDateRange(startDate, endDate, tick)
	const categories = Object.keys(data).slice(0, 2) // For now we ignore "Independents"

	/* Munge data into an array of this form:
	 *
	 * [
	 *   [
	 *     Date(2018, 11, 7, 2, 0),
	 *     { 'democrats': 0, 'republicans': 5 }
	 *   ],
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
			label = ((t.getDate() === 1) || (idx === 0)) ? format(t, 'MMM D') : format(t, 'D')
		}

		// Compare dates appropriately for the tick
		const cmpDates = tick === 'hour' ? sameHour : sameDate
		const valuesByCategory = categories.reduce((accumulator, category) => {
			// Find data matching the current category and time. If no data exists, set value to 0.
			const dataForDate = data[category].find(x => cmpDates(ISOtoDate(x[tick]), t))
			accumulator[category] = dataForDate ? dataForDate.count : 0
			return accumulator
		}, {})

		return [
			label,
			valuesByCategory
		]
	})

	// Calculate the maximum value of the range
	const allCounts = dataRows.reduce((accumulator, dataPoint) => {
		const counts = Object.keys(dataPoint[1]).map(category => {
			return dataPoint[1][category]
		})
		return accumulator.concat(counts)
	}, [])
	const maxRange = Math.max(...allCounts)

	return (
		<svg
			className="bar-chart"
			width={CHART_WIDTH}
			height={domainTicks.length * ROW_HEIGHT}
			viewBox={`0 0 ${CHART_WIDTH} ${domainTicks.length * ROW_HEIGHT}`}
			preserveAspectRatio="xMidYMin meet"
		>
			{dataRows.map((d, i) => (
				<BarChartRow
					key={i}
					label={d[0]}
					data={d[1]}
					y={i * (ROW_HEIGHT + ROW_GUTTER)}
					max={maxRange}
				/>
			))}
		</svg>
	)
}

TweetMultiBarChart.propTypes = {
	data: PropTypes.object.isRequired,
	startDate: PropTypes.instanceOf(Date).isRequired,
	endDate: PropTypes.instanceOf(Date).isRequired,
	tick: PropTypes.oneOf(['hour', 'day']).isRequired,
}
