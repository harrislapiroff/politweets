import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HashtagList from '~/components/HashtagList.js'
import ErrorBoundary from '~/components/ErrorBoundary.js'
import HashtagDetail from '~/containers/HashtagDetail.js'
import FilterBar from '~/components/FilterBar.js'
import { CATEGORY_CHOICES } from '~/utils/categories.js'

import './App.sass'

class App extends Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			summary: {},
			dateRange: 'past_day',
			category: 'party',
		}

		this.handleDateRangeChange = this.handleDateRangeChange.bind(this)
		this.handleCategoryChange = this.handleCategoryChange.bind(this)
	}

	async componentDidMount() {
		let response = await fetch(this.props.endpoints.summary)
		let summaryData = await response.json()
		this.setState({ loading: false, summary: summaryData })
	}

	handleDateRangeChange(e) {
		this.setState({ dateRange: e.target.value })
	}

	handleCategoryChange(e) {
		this.setState({ category: e.target.value })
	}

	render() {
		const dataForCurrentRange = this.state.summary[this.state.dateRange]
		const categorySet = CATEGORY_CHOICES.find(c => c.key === this.state.category)

		return (
			<BrowserRouter>
				<div className="App">
					<h1 className="site-title">
						What is congress tweeting about?
					</h1>

					<FilterBar
						dateRangeValue={this.state.dateRange}
						categoryValue={this.state.category}
						onCategoryChange={this.handleCategoryChange}
						onDateRangeChange={this.handleDateRangeChange}
					/>
					<Switch>
						<Route
							path="/"
							render={(props) => (
								<div className="split-pane">
									{categorySet.categories.map(cat => (
										<div className="split-pane__column" key={cat.key}>
											<ErrorBoundary>
												<HashtagList
													hashtags={this.state.loading ? [] : dataForCurrentRange[cat.key].popular_hashtags}
													category={cat}
													loading={this.state.loading}
												/>
											</ErrorBoundary>
										</div>
									))}
								</div>
							)}
							exact
						/>
						<Route
							path="/hashtag/:hashtag"
							render={(props) => (
								<HashtagDetail
									hashtag={props.match.params.hashtag}
									api={this.props.endpoints.hashtag}
									dateRange={this.state.dateRange}
									categories={categorySet.categories}
								/>
							)}
						/>
					</Switch>
				</div>
			</BrowserRouter>
		)
	}
}

App.propTypes = {
	endpoints: PropTypes.object.isRequired,
}

export default App;
