import React from 'react'
import PropTypes from 'prop-types'

import './LoadingBox.sass'

export default function LoadingBox ({ color }) {
	return (
		<div className="loading-box" style={{ backgroundColor: color }}>
			{/* space character to ensure the box displays at text height */}
			{'\u00A0'}
		</div>
	)
}

LoadingBox.propTypes = {
	color: PropTypes.string,
}

LoadingBox.defaultProps = {
	color: '#F0F0F0'
}
