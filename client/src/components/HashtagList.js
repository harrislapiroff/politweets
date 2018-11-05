import { range } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import LoadingBox from './LoadingBox.js'

import './HashtagList.sass'

const PARTY_LABELS = {
	'democrat': 'Democrat',
	'republican': 'Republican',
	'independent': 'Independent',
}

function HashtagListItemLoading() {
	return (
		<li className="hashtag-list__list-item">
			<div className="hashtag-list__list-item-link">
				<div
					className="hashtag-list__loading-tag"
					style={{
						width: `${Math.random() * 20 + 20}%` // Between 20 and 40% wide
					}}
				>
					<LoadingBox color="#DDD" />
				</div>
				<div className="hashtag-list__loading-count"><LoadingBox /></div>
			</div>
		</li>
	)
}

export default function HashtagList({
	hashtags,
	party,
	loading,
	expectedListSize,
}) {
	const bareHashtags = hashtags.map(x => ({
		tag: x.tag.slice(1),
		count: x.count
	}))
	return (
		<div className="hashtag-list">
			<h2 className="hashtag-list__title">
				<span
					className={`hashtag-list__title-highlight hashtag-list__title-highlight--${party}`}
				>
					{PARTY_LABELS[party]}s’
				</span>{' '}
				Hashtags
			</h2>
			<ol className="hashtag-list__list">
				{loading && range(0, 10).map(x => <HashtagListItemLoading key={x} />)}
				{!loading && bareHashtags.map(x => (
					<li
						className="hashtag-list__list-item"
						key={x.tag}
					>
						<Link className="hashtag-list__list-item-link" to={`/hashtag/${x.tag}`}>
							<span className="hashtag-list__hashtag">#{x.tag}</span>
							<span className="hashtag-list__count">
								<span className="hashtag-list__count-number">{x.count}</span> uses
							</span>
						</Link>
					</li>
				))}
			</ol>
		</div>
	)
}

HashtagList.propTypes = {
	hashtags: PropTypes.arrayOf(PropTypes.shape({
		'tag': PropTypes.string,
		'count': PropTypes.number,
	})),
	party: PropTypes.oneOf(['democrat', 'republican', 'independent']),
	loading: PropTypes.bool,
	/** Expected size of list. Will be used for loading animation */
	expectedListSize: PropTypes.number,
}

HashtagList.defaultProps = {
	hashtags: [],
	party: 'independents',
	loading: true,
	expectedListSize: 10,
}
