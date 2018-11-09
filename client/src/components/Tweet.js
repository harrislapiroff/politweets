import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'date-fns'

import './Tweet.sass'

export default function Tweet({ tweet }) {
	return (
		<div class="tweet">
			<div class="tweet__user">
				<div class="tweet__user-name">{tweet.member.full_name}</div>
				<div class="tweet__user-handle">@{tweet.member.twitter}</div>
			</div>
			<div class="tweet__text">{tweet.text}</div>
			<div class="tweet__footer">
				{format(tweet.time, 'h:mm A - MMM D, YYYY')}
			</div>
		</div>
	)
}

Tweet.propTypes = {
	tweet: PropTypes.object
}
