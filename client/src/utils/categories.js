export const DEMOCRATS = {
	key: 'democrats',
	tweetFilterFn: t => t.member.party === 'D',
}

export const REPUBLICANS = {
	key: 'republicans',
	tweetFilterFn: t => t.member.party === 'R',
}
