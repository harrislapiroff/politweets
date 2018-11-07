import React from 'react'
import PropTypes from 'prop-types'

import {
	LABEL_WIDTH,
	LABEL_GUTTER,
	BAR_HEIGHT,
	BAR_MAX_WIDTH,
	ROW_HEIGHT,
} from './measurements.js'

import './BarChartRow.sass'

export default function BarChartRow({ label, data, x, y, max }) {
	const categories = Object.keys(data)
	return (
		<g className="bar-chart__row" transform={`translate(${x} ${y})`}>
			<rect
				className="bar-chart__row-bg"
				x={LABEL_WIDTH + LABEL_GUTTER}
				y={0}
				width={BAR_MAX_WIDTH}
				height={ROW_HEIGHT}
			/>
			<text className='bar-chart__row-label' x={LABEL_WIDTH} y={BAR_HEIGHT + 4}>
				{label}
			</text>
			<g
				className='bar-chart__row-bars'
				transform={`translate(${LABEL_WIDTH + LABEL_GUTTER} 0)`}
			>
				{categories.map((c, i) => (
					<rect
						className={`bar-chart__bar bar-chart__bar--${c}`}
						x={0}
						y={i * BAR_HEIGHT}
						height={BAR_HEIGHT}
						width={max ? Math.floor((data[c] / max) * BAR_MAX_WIDTH) : 0}
						key={c}
					/>
				))}
			</g>
		</g>
	)
}

BarChartRow.propTypes = {
	label: PropTypes.string,
	data: PropTypes.object.isRequired,
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
