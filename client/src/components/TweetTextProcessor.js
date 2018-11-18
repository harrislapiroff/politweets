import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autolinker from 'autolinker'
import { XmlEntities } from 'html-entities'

export default class TweetTextProcessor extends Component {
	constructor(...args) {
		super(...args)
		this.entities = new XmlEntities()
	}

	processString(string) {
		// First off, let's decode HTML entities
		const decodedString = this.entities.decode(string)

		const matches = Autolinker.parse(decodedString, {
			hashtag: 'twitter',
			mention: 'twitter',
		})

		let lastStringStart = 0 // A cursor for the match loop
		const reactNodes = matches.reduce((reactNodes, match) => {
			// First add the string node between the last match and the current one
			reactNodes.push(decodedString.slice(lastStringStart, match.offset))
			// Next, process the current match
			reactNodes.push(
				<a
					href={match.getAnchorHref()}
					className="tweet__link"
					rel="noopener noreferrer"
					target="_blank"
					key={match.offset}
				>
					{match.getAnchorText()}
				</a>
			)
			// Update the cursor
			lastStringStart = match.offset + match.matchedText.length
			return reactNodes
		}, [])

		// Add remaining stringy bit to the node list, if any
		reactNodes.push(decodedString.slice(lastStringStart))
		return reactNodes
	}

	processChildren(children, key=0) {
		if (typeof children === 'string') {
			return this.processString(children)
		} else if (React.isValidElement(children) && (children.type !== 'a') && (children.type !== 'button')) {
			return React.cloneElement(children, {key: key}, this.parse(children.props.children))
		} else if (Array.isArray(children)) {
			return children.map((child, i) => this.processChildren(child, i))
		}
		return children;
	}

	render() {
		return this.processChildren(this.props.children)
	}
}

React.PropTypes = {
	children: PropTypes.node,
}
