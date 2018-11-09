import { cond, always } from 'ramda'
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import TweetMultiBarChart from '~/components/TweetMultiBarChart/index.js'
import Tweet from '~/components/Tweet.js'
import ErrorBoundary from '~/components/ErrorBoundary.js'
import { DATE_RANGE_OPTIONS, getDateRange } from '~/utils/date.js'
import { tweetsBetweenDates } from '~/utils/tweetFiltering.js'
import { DEMOCRATS, REPUBLICANS } from '~/utils/categories.js'

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
		const { tweets } = this.state
		const { hashtag } = this.props
		const dateRange = getDateRange(this.props.dateRange)
		const tick = this.props.dateRange === 'past_day' ? 'hour' : 'day'
		const categories = [DEMOCRATS, REPUBLICANS]
		const tweetsFiltered = tweets ? tweetsBetweenDates(
			tweets, dateRange.start, dateRange.end
		) : []

		return (
			<div className="hashtag-detail">
				{tweets && (
					<Fragment>
						<div className="hashtag-detail__specs">
							<ErrorBoundary>
								<h1 className="hashtag-detail__title">
									<span className="hashtag-detail__title-octothorpe">#</span>
									<span className="hashtag-detail__title-hashtag">{hashtag}</span>{' '}
									{this.state.loading && <span className="hashtag-detail__title-loading-indicator">Loading...</span>}
								</h1>
								<a
									className="hashtag-detail__twitter-link"
									href={`https://twitter.com/hashtag/${hashtag}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									See <strong>#{hashtag}</strong> on Twitter
								</a>
								<Link className="hashtag-detail__close" to="/" title="close">
									&times;
								</Link>
							</ErrorBoundary>
						</div>
						<div className="hashtag-detail__chart">
							<ErrorBoundary>
								<TweetMultiBarChart
									tweets={tweets}
									startDate={dateRange.start}
									endDate={dateRange.end}
									tick={tick}
									categories={categories}
								/>
							</ErrorBoundary>
						</div>
						<div className="hashtag-detail__tweets">
							<ErrorBoundary>
								{tweetsFiltered.map(t => (
									<Tweet
										key={t.id}
										tweet={t}
										className={cond([
											[t => t.member.party === 'D', always('democrats')],
											[t => t.member.party === 'R', always('republicans')],
											[t => t.member.party === 'I', always('independents')],
										])(t)}
									/>
								))}
							</ErrorBoundary>
						</div>
					</Fragment>
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
