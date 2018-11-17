import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { format } from 'date-fns'

import TweetTextProcessor from '~/components/TweetTextProcessor.js'

import './Tweet.sass'

const Tweet = React.forwardRef(({ tweet, className, large, ...props }, ref) => {
	const member = tweet.member
	let partyClass
	if (member.party === 'D') partyClass = 'democrats'
	if (member.party === 'R') partyClass = 'republicans'
	return (
		<div
			className={classNames(
				'tweet',
				className,
				{ 'tweet--large': large }
			)}
			ref={ref}
			{...props}
		>
			<a
				className="tweet__user"
				href={`https://twitter.com/${tweet.member.twitter}`}
			>
				<div className="tweet__avatar-container">
					<img
						className="tweet__avatar"
						alt={`${member.full_name}`}
						src={tweet.member.avatar}
					/>
				</div>
				<div className="tweet__user-id">
					<span className="tweet__user-name">{member.full_name}</span>{' '}
					<span className="tweet__user-designation">
						{member.chamber === 'S' && (
							<Fragment>
								Sen.{' '}
								<span className={`tweet__user-party tweet__user-party--${partyClass}`}>
									{member.party}
								</span>
								-{member.state}
							</Fragment>
						)}
						{member.chamber === 'H' && (
							<Fragment>
								<span className={`tweet__user-party tweet__user-party--${partyClass}`}>
									{member.party}
								</span>{' '}
								{member.state}-{member.district}
							</Fragment>
						)}
					</span>
				</div>
				<div className="tweet__user-handle">
					@{member.twitter}
				</div>
			</a>
			<div className={classNames(
				'tweet__text',
				{ 'tweet__text--large': large }
			)}>
				<TweetTextProcessor>{tweet.text}</TweetTextProcessor>
			</div>
			<div className="tweet__footer">
				<span className="tweet__date">{format(tweet.time, 'h:mm A – MMM D, YYYY')}</span>
				<a
					href={`https://twitter.com/${member.twitter}/status/${tweet.id}`}
					className="tweet__link-original"
				>
					Original on Twitter
				</a>
			</div>
		</div>
	)
})

Tweet.propTypes = {
	tweet: PropTypes.object.isRequired,
	className: PropTypes.string,
	large: PropTypes.bool,
}

Tweet.defaultProps = {
	string: '',
	large: false,
}

export default Tweet
