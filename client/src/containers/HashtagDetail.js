import { toPairs } from 'ramda'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import {
	VictoryChart,
	VictoryGroup,
	VictoryTooltip,
	VictoryVoronoiContainer,
	VictoryBar,
} from 'victory'

import ErrorBoundary from '../components/ErrorBoundary.js'
import { DATE_RANGE_OPTIONS, getDateRange } from '../utils/date.js'
import { PARTY_COLORS } from '../utils/parties.js'

import './HashtagDetail.css'

function ISOtoDate(ISODate) {
	return DateTime.fromISO(ISODate).toJSDate()
}


/** Convert API data to xy points for a chart. Auto detect whether date is in day or hour format */
function apiDataToChartData(data) {
	return data.map(d => ({
		x: 'day' in d ? ISOtoDate(d.day) : ISOtoDate(d.hour),
		y: d.count,
	}))
}


export default class HashtagDetail extends Component {
	constructor() {
		super()
		this.state = {
			loading: true,
			data: {},
		}
	}

	componentDidMount() {
		this.fetchData()
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.api !== prevProps.api ||
			this.props.hashtag !== prevProps.hashtag
		) {
			this.fetchData()
		}
	}

	async fetchData() {
		this.setState({ loading: true })
		const requestUrl = this.props.api.replace('__PLACEHOLDER__', this.props.hashtag)
		const response = await fetch(requestUrl)
		const summaryData = await response.json()
		this.setState({ loading: false, data: summaryData })
	}

	render() {
		const dataForDateRange = this.state.data[this.props.dateRange]
		const dateRange = getDateRange(this.props.dateRange)
		let chartData = { democrats: [], republicans: [], independents: []}

		if (dataForDateRange) {
			chartData.democrats = apiDataToChartData(dataForDateRange.democrats)
			chartData.republicans = apiDataToChartData(dataForDateRange.republicans)
			chartData.independents = apiDataToChartData(dataForDateRange.independents)
		}

		const chartDataAsPairs = toPairs(chartData).filter(x => x[1].length > 0)

		return (
			<div className="hashtag-detail">
				<h1 className="hashtag-detail__title">
					<span className="hashtag-detail__title-octothorpe">#</span>
					<span className="hashtag-detail__title-hashtag">{this.props.hashtag}</span>{' '}
					{this.state.loading && <span className="hashtag-detail__title-loading-indicator">Loading...</span>}
				</h1>
				<ErrorBoundary>
					<VictoryChart
						domainPadding={{ y: 10 }}
						scale={{ x: 'time' }}
						minDomain={{ x: dateRange.start }}
						maxDomain={{ x: dateRange.end }}
						style={{
							fontFamily: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
						}}
						animate={{ duration: 500, easing: "linear" }}
						width={1000}
						height={250}
					>
						<VictoryGroup
							colorScale={chartDataAsPairs.map(x => PARTY_COLORS[x[0]])}
							labels={d => `Tweets: ${d.y}`}
							labelComponent={
								<VictoryTooltip
									style={{ fontSize: 10 }}
								/>
							}
							style={{data: { width: 8 }}}
							offset={10}
						>
							{chartDataAsPairs.map(x => (
									<VictoryBar
										key={x[0]}
										data={x[1]}
									/>
							))}
						</VictoryGroup>
					</VictoryChart>
				</ErrorBoundary>
			</div>
		)
	}
}

HashtagDetail.propTypes = {
	api: PropTypes.string.isRequired,
	hashtag: PropTypes.string.isRequired,
	dateRange: PropTypes.oneOf(Object.keys(DATE_RANGE_OPTIONS)).isRequired,
}
