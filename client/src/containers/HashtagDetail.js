import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TweetMultiBarChart from '~/components/TweetMultiBarChart/index.js'
import TweetList from '~/components/TweetList.js'
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
					<div className="hashtag-detail__specs-inner">
						<ErrorBoundary>

							<h1 className="hashtag-detail__title">
								<span className="hashtag-detail__title-octothorpe">#</span>
								<span className="hashtag-detail__title-hashtag">{hashtag}</span>
							</h1>

							<Legend
								loading={loading}
								categories={categories}
								tweets={tweetsFiltered}
							/>

							<div className="hashtag-detail__navigation">
								<NavLink
									className="hashtag-detail__navigation-item"
									activeClassName="hashtag-detail__navigation-item--active"
									aria-current="true"
									to={`/hashtag/${hashtag}`}
									exact
								>Overview</NavLink>
								<NavLink
									className="hashtag-detail__navigation-item"
									activeClassName="hashtag-detail__navigation-item--active"
									aria-current="true"
									to={`/hashtag/${hashtag}/tweets`}
									exact
								>Tweets</NavLink>
							</div>

							<a
								className="hashtag-detail__twitter-link"
								href={`https://twitter.com/hashtag/${hashtag}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<strong>#{hashtag}</strong> on Twitter
							</a>

							<Link className="hashtag-detail__overview-link" to="/" title="close">
								Back to hashtags
							</Link>

						</ErrorBoundary>
					</div>{/* /.hashtag-detail__specs-inner */}
				</div>{/* /.hashtag-detail__specs*/}

				<Switch>
					<Route
						path='/hashtag/:hashtag'
						render={(props) => (
							<Fragment>
								<div className={classNames({
									'hashtag-detail__chart': true,
									'hashtag-detail__chart--shimmer': loading,
								})}>
									<ErrorBoundary>
										{!!tweets && <TweetMultiBarChart
											tweets={tweets}
											startDate={dateRange.start}
											endDate={dateRange.end}
											tick={tick}
											categories={categories}
										/>}
									</ErrorBoundary>
								</div>
								<div className={classNames({
									'hashtag-detail__tweets': true,
									'hashtag-detail__tweets--shimmer': loading,
								})}>
									<ErrorBoundary>
										{!!tweets && (
											<Fragment>
												<TweetList
													tweets={tweetsFiltered.slice(0, 3)}
													classNameFn={(t) => categories.reduce(
														(acc, cat) => cat.tweetFilterFn(t) ? `tweet--${cat.key}` : acc, ''
													)}
												/>
												<Link
													className="hashtag-detail__tweets-link"
													to={`/hashtag/${hashtag}/tweets`}
												>
													All <strong>#{hashtag}</strong> tweets
												</Link>
											</Fragment>
										)}
									</ErrorBoundary>
								</div>
							</Fragment>
						)}
						exact
					/>
					<Route
						path='/hashtag/:hashtag/tweets'
						render={(props) => (
							<div className={classNames({
								'hashtag-detail__tweets': true,
								'hashtag-detail__tweets--wide': true,
								'hashtag-detail__tweets--shimmer': loading,
							})}>
								<ErrorBoundary>
									{!!tweets && (
										<TweetList
											tweets={tweetsFiltered}
											classNameFn={(t) => categories.reduce(
												(acc, cat) => cat.tweetFilterFn(t) ? `tweet--${cat.key}` : acc, ''
											)}
										/>
									)}
								</ErrorBoundary>
							</div>
						)}
					/>
				</Switch>

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
