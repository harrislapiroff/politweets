import { toPairs } from 'ramda'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HashtagList from './components/HashtagList.js'

import './App.css'

const DATE_RANGE_OPTIONS = {
	'past_day': 'Past 24 Hours',
	'past_week': 'Past 7 Days',
	'past_month': 'Past 30 Days',
}

class App extends Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			summary: {},
			dateRange: 'past_day',
		}

		this.handleDateRangeChange = this.handleDateRangeChange.bind(this)
	}

	async componentDidMount() {
		let response = await fetch(this.props.endpoints.summary)
		let summaryData = await response.json()
		this.setState({ loading: false, summary: summaryData })
	}

	handleDateRangeChange(e) {
		this.setState({ dateRange: e.target.value })
	}

	render() {
		const dateForCurrentRange = this.state.summary[this.state.dateRange]

		return (
			<div className="App">
				<h1 className="site-title">
					What is congress tweeting about?
				</h1>
				<select value={this.state.dateRange} onChange={this.handleDateRangeChange}>
					{toPairs(DATE_RANGE_OPTIONS).map(option => (
						<option value={option[0]} key={option[0]}>
							{option[1]}
						</option>
					))}
				</select>
				<div className="split-pane">
					<div className="split-pane__column">
						<HashtagList
							hashtags={this.state.loading ? [] : dateForCurrentRange.democrats.popular_hashtags}
							party="democrat"
							loading={this.state.loading}
						/>
					</div>
					<div className="split-pane__column">
						<div className="pane-content">
							<HashtagList
								hashtags={this.state.loading ? [] : dateForCurrentRange.republicans.popular_hashtags}
								party="republican"
								loading={this.state.loading}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

App.propTypes = {
	endpoints: PropTypes.object.isRequired,
}

export default App;
