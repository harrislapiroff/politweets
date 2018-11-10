import React from 'react'
import PropTypes from 'prop-types'

import { category } from '~/utils/prop-types.js'
import { capitalize } from '~/utils/string.js'

import './Legend.sass'

export default function Legend({ categories, tweets }) {
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
	categories: PropTypes.arrayOf(PropTypes.shape(category))
}
