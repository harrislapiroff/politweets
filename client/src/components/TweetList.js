import React from 'react'

import Tweet from '~/components/Tweet'

export default function TweetList({ tweets, classNameFn }) {
	return tweets.map(t => <Tweet tweet={t} key={t.id} className={classNameFn(t)} />)
}
