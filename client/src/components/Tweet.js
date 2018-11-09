import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'date-fns'

import './Tweet.sass'

export default function Tweet({ tweet, className }) {
	return (
		<div className={`tweet tweet--${className}`}>
			<div className="tweet__user">
				<div className="tweet__user-name">{tweet.member.full_name}</div>
				<div className="tweet__user-handle">@{tweet.member.twitter}</div>
			</div>
			<div className="tweet__text">{tweet.text}</div>
			<div className="tweet__footer">
				{format(tweet.time, 'h:mm A - MMM D, YYYY')}
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
