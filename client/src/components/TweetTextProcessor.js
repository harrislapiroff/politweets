import React from 'react'
import PropTypes from 'prop-types'

import { XmlEntities } from 'html-entities'

const entities = new XmlEntities()

export default function TweetTextProcessor({ children }) {
	return entities.decode(children)
}

React.PropTypes = {
	children: PropTypes.node,
}
