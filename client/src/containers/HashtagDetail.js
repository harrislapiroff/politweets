import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import TweetMultiBarChart from '~/components/TweetMultiBarChart/index.js'
import ErrorBoundary from '~/components/ErrorBoundary.js'
import { DATE_RANGE_OPTIONS, getDateRange } from '~/utils/date.js'

import './HashtagDetail.sass'


export default class HashtagDetail extends Component {
	constructor() {
		super()
		this.state = {
			loading: true,
			data: null,
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
		const { data } = this.state
		const dataForDateRange = data ? data[this.props.dateRange] : null
		const dateRange = getDateRange(this.props.dateRange)
		const tick = this.props.dateRange === 'past_day' ? 'hour' : 'day'

		return (
			<div className="hashtag-detail">
				<Link className="hashtag-detail__close" to="/" title="close">
					&times;
				</Link>
				<h1 className="hashtag-detail__title">
					<span className="hashtag-detail__title-octothorpe">#</span>
					<span className="hashtag-detail__title-hashtag">{this.props.hashtag}</span>{' '}
					{this.state.loading && <span className="hashtag-detail__title-loading-indicator">Loading...</span>}
				</h1>
				{data && (
					<ErrorBoundary>
						<TweetMultiBarChart
							data={dataForDateRange}
							startDate={dateRange.start}
							endDate={dateRange.end}
							tick={tick}
						/>
					</ErrorBoundary>
				)}
			</div>
		)
	}
}

HashtagDetail.propTypes = {
	api: PropTypes.string.isRequired,
	hashtag: PropTypes.string.isRequired,
	dateRange: PropTypes.oneOf(Object.keys(DATE_RANGE_OPTIONS)).isRequired,
}
