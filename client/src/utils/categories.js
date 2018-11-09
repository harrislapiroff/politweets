export const DEMOCRATS = {
	key: 'democrats',
	possessive: 'Democrats’',
	tweetFilterFn: t => t.member.party === 'D',
}

export const REPUBLICANS = {
	key: 'republicans',
	possessive: 'Republicans’',
	tweetFilterFn: t => t.member.party === 'R',
}

export const HOUSE = {
	key: 'representatives',
	possessive: 'Representatives’',
	tweetFilterFn: t => t.member.chamber === 'H',
}

export const SENATE = {
	key: 'senators',
	possessive: 'Senators’',
	tweetFilterFn: t => t.member.chamber === 'S',
}

export const MEN = {
	key: 'men',
	possessive: 'Men’s',
	tweetFilterFn: t => t.member.gender === 'M',
}

export const WOMEN = {
	key: 'women',
	possessive: 'Women’s',
	tweetFilterFn: t => t.member.gender === 'F',
}

// Category sets

export const PARTY = [DEMOCRATS, REPUBLICANS]
export const CHAMBER = [HOUSE, SENATE]
export const GENDER = [WOMEN, MEN]

export const CATEGORY_CHOICES = [
	{ key: 'party', label: 'By party', categories: PARTY },
	{ key: 'gender', label: 'By gender', categories: GENDER },
	{ key: 'chamber', label: 'By chamber', categories: CHAMBER },
]
