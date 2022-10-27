
export const splitStr = (str) => {
    return str.split('_')[0]
}

// TODO: deal with timezone offset
// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd

export const getDaysInMonth = (month, year, isCurrentMonth) => {
  const date = new Date(year, month, 1);
  const days = [];
  const today = new Date()

  while (date.getMonth() === month) {
    let dateObj = { date: new Date(date).toISOString().split('T')[0], isCurrentMonth }
    if(date.getDate() === today.getDate() && month === (new Date()).getMonth()) { // control for year here also
      dateObj['isToday'] = true
    } 
    days.push(dateObj);
    date.setDate(date.getDate() + 1);
  }
  
  const first = new Date(days[0].date).getDay()
  const last = days[days.length - 1].date
  
  return { days, first, last }
}
