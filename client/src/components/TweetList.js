import React from 'react'
import posed, { PoseGroup } from 'react-pose'

import Tweet from '~/components/Tweet'

const TweetWrapper = posed.div({
	enter: { y: 0, opacity: 1, delay: ({ i }) => i * 150 },
	exit: { y: 50, opacity: 0 },
})

export default function TweetList({ tweets, classNameFn }) {
	return (
		<PoseGroup>
			{tweets.map((t, i) => (
				<TweetWrapper key={t.id} i={i}>
					<Tweet tweet={t} className={classNameFn(t)} />
				</TweetWrapper>
			))}
		</PoseGroup>
	)
}
