import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
				{this.state.loading ? 'Loading...' : (
					<div className="split-pane">
						<div className="split-pane__column">
							<h2 className="pane-title">
								<span className="pane-title__highlight pane-title__highlight--democrat">
									Democrat
								</span>{' '}
								Hashtags
							</h2>
							<div className="pane-content">
								<ol className="hashtag-list">
									{this.state.summary.past_month.democrats.popular_hashtags.map(x => (
										<li className="hashtag-list__item" key={x[0]}>
											<span className="hashtag-list__hashtag">{x[0]}</span>
											<span className="hashtag-list__count">{x[1]} uses</span>
										</li>
									))}
								</ol>
							</div>
						</div>
						<div className="split-pane__column">
							<h2 className="pane-title">
								<span className="pane-title__highlight pane-title__highlight--republican">
									Republican
								</span>{' '}
								Hashtags
							</h2>
							<div className="pane-content">
								<ol className="hashtag-list">
									{this.state.summary.past_month.republicans.popular_hashtags.map(x => (
										<li className="hashtag-list__item" key={x[0]}>
											<span className="hashtag-list__hashtag">{x[0]}</span>
											<span className="hashtag-list__count">{x[1]} uses</span>
										</li>
									))}
								</ol>
							</div>
						</div>
					</div>
				)}
      </div>
    )
  }
}

App.propTypes = {
	endpoints: PropTypes.object.isRequired,
}

export default App;
