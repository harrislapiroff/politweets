import { cond, always } from 'ramda'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import TweetMultiBarChart from '~/components/TweetMultiBarChart/index.js'
import Tweet from '~/components/Tweet.js'
import Legend from '~/components/Legend.js'
import ErrorBoundary from '~/components/ErrorBoundary.js'
import { DATE_RANGE_OPTIONS, getDateRange } from '~/utils/date.js'
import { tweetsBetweenDates } from '~/utils/tweetFiltering.js'
import { category } from '~/utils/prop-types.js'

import './HashtagDetail.sass'

export default class HashtagDetail extends Component {
	constructor() {
		super()
		this.state = {
			loading: true,
			tweets: null,
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
		const hastagData = await response.json()
		this.setState({ loading: false, tweets: hastagData })
	}

	render() {
		const { tweets, loading } = this.state
		const { hashtag, categories } = this.props
		const dateRange = getDateRange(this.props.dateRange)
		const tick = this.props.dateRange === 'past_day' ? 'hour' : 'day'
		const tweetsFiltered = tweets ? tweetsBetweenDates(
			tweets, dateRange.start, dateRange.end
		) : []

		return (
			<div className="hashtag-detail">
				<div className="hashtag-detail__specs">
					<ErrorBoundary>
						<h1 className="hashtag-detail__title">
							<span className="hashtag-detail__title-octothorpe">#</span>
							<span className="hashtag-detail__title-hashtag">{hashtag}</span>{' '}
						</h1>
						<Legend
							loading={loading}
							categories={categories}
							tweets={tweetsFiltered}
						/>
						<a
							className="hashtag-detail__twitter-link"
							href={`https://twitter.com/hashtag/${hashtag}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<strong>#{hashtag}</strong> on Twitter
						</a>
						<Link className="hashtag-detail__overview-link" to="/" title="close">
							Back to overview
						</Link>
					</ErrorBoundary>
				</div>
				<div className={'hashtag-detail__chart ' + (loading ? 'hashtag-detail__chart--shimmer' : '')}>
					{tweets && (
						<ErrorBoundary>
							<TweetMultiBarChart
								tweets={tweets}
								startDate={dateRange.start}
								endDate={dateRange.end}
								tick={tick}
								categories={categories}
							/>
						</ErrorBoundary>
					)}
				</div>
				<div className={'hashtag-detail__tweets ' + (loading ? 'hashtag-detail__tweets--shimmer' : '')}>
					{tweets && (
						<ErrorBoundary>
							{tweetsFiltered.map(t => (
								<Tweet
									key={t.id}
									tweet={t}
									className={cond(
										categories.map(
											c => [c.tweetFilterFn, always(c.key)]
										)
									)(t)}
								/>
							))}
						</ErrorBoundary>
					)}
				</div>
			</div>
		)
	}
}

HashtagDetail.propTypes = {
	api: PropTypes.string.isRequired,
	hashtag: PropTypes.string.isRequired,
	dateRange: PropTypes.oneOf(Object.keys(DATE_RANGE_OPTIONS)).isRequired,
	categories: PropTypes.arrayOf(PropTypes.shape(category))
}
