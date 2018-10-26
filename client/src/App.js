import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HashtagList from './components/HashtagList.js'

import './App.css'

class App extends Component {
	constructor() {
		super()
		this.state = {
			loading: true,
			summary: {},
		}
	}

	async componentDidMount() {
		let response = await fetch(this.props.endpoints.summary)
		let summaryData = await response.json()
		this.setState({ loading: false, summary: summaryData })
	}

	render() {
		return (
			<div className="App">
				<h1 className="site-title">
					What is congress tweeting about?
				</h1>
				<div className="split-pane">
					<div className="split-pane__column">
						<HashtagList
							hashtags={this.state.loading ? [] : this.state.summary.past_month.democrats.popular_hashtags}
							party="democrat"
							loading={this.state.loading}
						/>
					</div>
					<div className="split-pane__column">
						<div className="pane-content">
							<HashtagList
								hashtags={this.state.loading ? [] : this.state.summary.past_month.republicans.popular_hashtags}
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
