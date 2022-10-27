import { useState } from 'react'
import { getDaysInMonth } from '../src/utils/utils'

// TODO: is there a place for useReducer here...?

const useCalendarDates = () => {
  const d = new Date()
  const month = d.getMonth()
  const year = d.getFullYear()

  const [date, setDate] = useState({ month, year })

  let { first, days, last } = getDaysInMonth(date.month, date.year, true)

  let previousMonth
  if (date.month - 1 === -1) {
    previousMonth = getDaysInMonth(11, date.year - 1, false)
  } else {
    previousMonth = getDaysInMonth(date.month - 1, date.year, false)
  }

  let followingMonth
  if (date.month + 1 === 12) {
    followingMonth = getDaysInMonth(0, date.year + 1, false)
  } else {
    followingMonth = getDaysInMonth(date.month + 1, date.year, false)
  }

  let lastXdaysOfPreviousMonth
  if (first === 0) {
    lastXdaysOfPreviousMonth = []
  } else {
    lastXdaysOfPreviousMonth = previousMonth.days.slice(-first)
  }

  const numOfDaysToGetInFollowingMonth =
    42 - (lastXdaysOfPreviousMonth.length + days.length)

  const nextXdaysOfFollowingMonth = followingMonth.days.slice(
    0,
    numOfDaysToGetInFollowingMonth
  )

  days = [...lastXdaysOfPreviousMonth, ...days, ...nextXdaysOfFollowingMonth]

  const currentMonth = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][date.month]

  const handleDateIncrement = () => {
    if (date.month + 1 === 12) {
      setDate({ year: date.year + 1, month: 0 })
      return
    }
    setDate({ ...date, month: date.month + 1 })
  }

  const handleDateDecrement = () => {
    if (!date.month) return // for this feature as it stands now, full featured decrement doesn't even make sense
    setDate({ ...date, month: date.month - 1 })
  }

  const handleDateClick = (date) => console.log(date)

  const handleSuggestedDate = ([suggestedDate]) => {
    let futureDate
    let today
    switch (suggestedDate) {
      case 'in_one_week':
        today = new Date()
        const nextweek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 7
        )
        console.log(nextweek)
        break
      case 'in_one_month':
        today = new Date()
        futureDate = today.setMonth(today.getMonth() + 1)
        console.log(new Date(futureDate))
        break
      case 'end_of_month':
        console.log(last)
        break
      case 'end_of_quarter':
        today = new Date()
        let quarter = Math.floor(today.getMonth() / 3)
        let startDate = new Date(today.getFullYear(), quarter * 3, 1)
        let endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 3,
          0
        )
        console.log(endDate)
        break
      default:
        console.log(`No case for ${suggestedDate}.`)
    }
    return futureDate
  }

  return {
    days,
    handleDateIncrement,
    handleDateDecrement,
    handleDateClick,
    handleSuggestedDate,
    currentMonth,
  }
}

export default useCalendarDates
