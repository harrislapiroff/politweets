import React from 'react'
import posed, { PoseGroup } from 'react-pose'

import OriginalTweet from '~/components/Tweet'

const TweetWrapper = posed(OriginalTweet)({
	enter: { y: 0, opacity: 1, delay: ({ i }) => i * 150 },
	exit: { y: 50, opacity: 0 },
})

export default function TweetList({ tweets, classNameFn }) {
	return (
		<PoseGroup>
			{tweets.map((t, i) => (
				<TweetWrapper
					key={t.id}
					i={i}
					tweet={t}
					className={classNameFn(t)}
				/>
			))}
		</PoseGroup>
	)
}
