import React from 'react'
import PropTypes from 'prop-types'

import LoadingBox from '~/components/LoadingBox.js'
import { category } from '~/utils/prop-types.js'
import { capitalize } from '~/utils/string.js'

import './Legend.sass'


function LoadingLegend({ categories }) {
	return (
		<div className="legend">
				{categories.map(cat => (
					<div key={cat.key} className={`legend__item legend__item--${cat.key}`}>
						<LoadingBox color="#DDD" />
					</div>
				))}
		</div>
	)
}


export default function Legend({ categories, tweets, loading }) {
	// If it's loading, show the loading bars
	if (loading) return <LoadingLegend categories={categories} />
	// Otherwise render the real legend
	return (
		<div className="legend">
			{categories.map(cat => (
				<div key={cat.key} className={`legend__item legend__item--${cat.key}`}>
					<span className="legend__number">{tweets.filter(cat.tweetFilterFn).length}</span>{' '}
					tweets by{' '}
					<span className={`legend__category legend__category--${cat.key}`}>
						{capitalize(cat.key)}
					</span>
				</div>
			))}
		</div>
	)
}

Legend.propTypes = {
	loading: PropTypes.bool,
	tweets: PropTypes.array,
	categories: PropTypes.arrayOf(PropTypes.shape(category)),
}
