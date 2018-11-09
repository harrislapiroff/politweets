import React, { Component } from 'react'

import './ErrorBoundary.sass'

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	componentDidCatch(error, info) {
		// Update state so the next render will show the fallback UI.
		this.setState({ hasError: true, error })
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div className="error-boundary">
					<span className="error-lede">An error occurred:</span> {'' + this.state.error}
				</div>
			)
		}

		return this.props.children;
	}
}
