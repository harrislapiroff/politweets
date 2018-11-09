import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'date-fns'

import TweetTextProcessor from '~/components/TweetTextProcessor.js'

import './Tweet.sass'

export default function Tweet({ tweet, className }) {
	return (
		<div className={`tweet tweet--${className}`}>
			<div className="tweet__user">
				<div className="tweet__user-name">{tweet.member.full_name}</div>
				<div className="tweet__user-handle">@{tweet.member.twitter}</div>
			</div>
			<div className="tweet__text">
				<TweetTextProcessor>{tweet.text}</TweetTextProcessor>
			</div>
			<div className="tweet__footer">
				<span className="tweet__date">{format(tweet.time, 'h:mm A – MMM D, YYYY')}</span>
				<a
					href={`https://twitter.com/${tweet.member.twitter}/status/${tweet.id}`}
					className="tweet__link-original"
				>
					Original on Twitter
				</a>
			</div>
		</div>
	)
}

Tweet.propTypes = {
	tweet: PropTypes.object.isRequired,
	className: PropTypes.string,
}

Tweet.defaultProps = {
	string: '',
}
