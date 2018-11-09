import React from 'react'
import PropTypes from 'prop-types'

import {
	LABEL_WIDTH,
	GUTTER,
	BAR_HEIGHT,
	BAR_MAX_WIDTH,
	TWEET_NODE_WIDTH,
	TWEET_NODE_GUTTER,
	ROW_GUTTER,
} from './measurements.js'
import { pad, NBSP } from '~/utils/string.js'

import './BarChartRow.sass'

export default function BarChartRow({
	active,
	onMouseOver,
	onMouseOut,
	label,
	tweetsByCategory,
	x,
	y,
	labelWidth,
	labelGutter,
	barHeight,
	barMaxWidth,
	nodeGutter,
	nodeWidth,
	rowGutter,
}) {
	const categories = Object.keys(tweetsByCategory)
	return (
		<g
			className={`bar-chart__row bar-chart__row--${active ? 'active' : 'inactive'}`}
			transform={`translate(${x} ${y})`}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
		>
			<rect
				className="pointer-events-target"
				x={0}
				y={0}
				width={labelWidth * 2 + labelGutter * 2 + barMaxWidth}
				height={barHeight * 2 + nodeGutter + rowGutter}
				fill="#FFF"
			/>
			<rect
				className="bar-chart__row-bg"
				x={labelWidth + labelGutter}
				y={0}
				width={barMaxWidth}
				height={barHeight * 2 + nodeGutter}
			/>
			<text className='bar-chart__row-label bar-chart__row-label--left' x={labelWidth} y={barHeight + 4}>
				{label}
			</text>
			<g
				className='bar-chart__row-bars'
				transform={`translate(${labelWidth + labelGutter} 0)`}
			>
				{categories.map((category, i) => (
					<g
						transform={`translate(0 ${i * (barHeight + nodeGutter)})`}
						key={category}
					>
						{tweetsByCategory[category].map((tweet, j) => (
							<rect
								key={tweet.id}
								x={j * (nodeWidth + nodeGutter)}
								y={0}
								width={nodeWidth}
								height={barHeight}
								className={`bar-chart__tweet-node bar-chart__tweet-node--${category}`}
							/>
						))}
					</g>
				))}
			</g>
			<text
				className='bar-chart__row-label bar-chart__row-label--right'
				y={barHeight + 4}
				x={labelWidth + labelGutter + barMaxWidth + labelGutter}
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
	active: PropTypes.bool,
	onMouseOver: PropTypes.func,
	onMouseOut: PropTypes.func,
	label: PropTypes.string,
	data: PropTypes.object,
	tweetsByCategory: PropTypes.object.isRequired,
	x: PropTypes.number,
	y: PropTypes.number,
	labelWidth: PropTypes.number,
	labelGutter: PropTypes.number,
	barMaxWidth: PropTypes.number,
	barHeight: PropTypes.number,
	nodeWidth: PropTypes.number,
	nodeGutter: PropTypes.number,
}

BarChartRow.defaultProps = {
	active: true,
	onMouseOver: () => {},
	onMouseOut: () => {},
	label: '',
	x: 0,
	y: 0,
	labelWidth: LABEL_WIDTH,
	labelGutter: GUTTER,
	barMaxWidth: BAR_MAX_WIDTH,
	barHeight: BAR_HEIGHT,
	nodeWidth: TWEET_NODE_WIDTH,
	nodeGutter: TWEET_NODE_GUTTER,
	rowGutter: ROW_GUTTER,
}
