import React from 'react'
import PropTypes from 'prop-types'

import {
	LABEL_WIDTH,
	GUTTER,
	BAR_HEIGHT,
	BAR_MAX_WIDTH,
	ROW_HEIGHT,
	TWEET_NODE_WIDTH,
	TWEET_NODE_GUTTER,
} from './measurements.js'
import { pad, NBSP } from '~/utils/string.js'

import './BarChartRow.sass'

export default function BarChartRow({
	label,
	tweetsByCategory,
	x,
	y,
	max
}) {
	const categories = Object.keys(tweetsByCategory)
	return (
		<g className="bar-chart__row" transform={`translate(${x} ${y})`}>
			<rect
				className="bar-chart__row-bg"
				x={LABEL_WIDTH + GUTTER}
				y={0}
				width={BAR_MAX_WIDTH}
				height={ROW_HEIGHT}
			/>
			<text className='bar-chart__row-label bar-chart__row-label--left' x={LABEL_WIDTH} y={BAR_HEIGHT + 4}>
				{label}
			</text>
			<g
				className='bar-chart__row-bars'
				transform={`translate(${LABEL_WIDTH + GUTTER} 0)`}
			>
				{categories.map((category, i) => (
					<g
						transform={`translate(0 ${i * (BAR_HEIGHT + TWEET_NODE_GUTTER)})`}
						key={category}
					>
						{tweetsByCategory[category].map((tweet, j) => (
							<rect
								key={tweet.id}
								x={j * (TWEET_NODE_WIDTH + TWEET_NODE_GUTTER)}
								y={0}
								width={TWEET_NODE_WIDTH}
								height={BAR_HEIGHT}
								className={`bar-chart__tweet-node bar-chart__tweet-node--${category}`}
							/>
						))}
					</g>
				))}
			</g>
			<text
				className='bar-chart__row-label bar-chart__row-label--right'
				y={BAR_HEIGHT + 4}
				x={LABEL_WIDTH + GUTTER + BAR_MAX_WIDTH + GUTTER}
			>
				{categories.map((c, i) => (
					<tspan key={c} className={`bar-chart__text bar-chart__text--${c}`}>
						{pad(tweetsByCategory[c].length, 2, NBSP)}{' '}
					</tspan>
				))}
			</text>
		</g>
	)
}

BarChartRow.propTypes = {
	label: PropTypes.string,
	data: PropTypes.object,
	tweetsByCategory: PropTypes.object.isRequired,
	x: PropTypes.number,
	y: PropTypes.number,
	max: PropTypes.number,
}

BarChartRow.defaultProps = {
	label: '',
	x: 0,
	y: 0,
	max: 100,
}
