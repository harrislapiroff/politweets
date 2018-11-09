import { toPairs } from 'ramda'
import React from 'react'

import { DATE_RANGE_OPTIONS } from '~/utils/date.js'
import { CATEGORY_CHOICES } from '~/utils/categories.js'

import './FilterBar.sass'

export default function FilterBar({
	dateRangeValue,
	categoryValue,
	onDateRangeChange,
	onCategoryChange,
}) {
	return (
		<div className="filter-bar">
			<select
				className="filter-bar__select"
				value={dateRangeValue}
				onChange={onDateRangeChange}
			>
				{toPairs(DATE_RANGE_OPTIONS).map(option => (
					<option value={option[0]} key={option[0]}>
						{option[1]}
					</option>
				))}
			</select>

			<select
				className="filter-bar__select"
				value={categoryValue}
				onChange={onCategoryChange}
			>
				{CATEGORY_CHOICES.map(option => (
					<option value={option.key} key={option.key}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}
