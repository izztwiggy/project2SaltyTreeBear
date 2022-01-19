// let birthdayYear = 1995
// let birthMonth = 09
// let birthDay = 26

// let bithDate = new Date(birthdayYear, birthMonth, birthDay)

function calculateAge(year, month, day){
    let today = new Date()   
    let startDay = new Date(year,month,day)
    let startCheck = startDay.valueOf()
    let todayCheck = today.valueOf()
    const oneDay = (1000 * 60 * 60 * 24)
    
    let difference = todayCheck - startCheck
    return (Math.floor((difference /oneDay)/ 365))
    
    

}

// calculateAge(birthdayYear, birthMonth, birthDay)
// console.log(calculateAge(birthdayYear, birthMonth, birthDay))

class Calendar {
    constructor(startDate, currentMonth, currentYear){
        this.startDate = startDate,
        this.currentMonth = currentMonth,
        this.currentYear = currentYear
    }
    isLeap(year){
        if(year % 4 === 0 && year % 100 !== 0){
        return true
        } else if(year % 4 === 0 && year % 100 === 0){
            if(year % 400 !== 0){
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }
    febDays(year){
        if(this.isLeap(year)){
            return 29
        } else {
            return 28
        }
    }
    movingForward(year, month){
        this.currentYear = month < 11 ? year : year + 1
        this.currentMonth = year > this.currentYear ? 0 : month + 1
        return this.currentYear, this.currentMonth
    }
    goingBackwards(year, month){
        this.currentYear = month < 1 ? year - 1 : year
        this.currentMonth = year > this.currentYear ? 11 : month - 1
        return this.currentYear, this.currentMonth
    }
}

const now = new Date()
const showCalendar = new Calendar(
    now,
    now.getMonth(),
    now.getFullYear()
)

const months = [
    {name: 'January', days: 31},
    {name: 'February', days:(showCalendar.febDays(showCalendar.currentYear))},
    {name: 'March', days: 31}, 
    {name: 'April', days: 30}, 
    {name: 'May', days: 31}, 
    {name: 'June', days: 30}, 
    {name:'July',days: 31}, 
    {name:'August', days: 31}, 
    {name:'September', days: 30}, 
    {name:'October', days: 31}, 
    {name: 'November', days: 30}, 
    {name: 'December', days: 31}
]

const dayNames = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const daysAbrv = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isLeap(year){
    if(year % 4 === 0 && year % 100 !== 0){
    return true
    } else if(year % 4 === 0 && year % 100 === 0){
        if(year % 400 !== 0){
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}
function febDays(year){
    if(isLeap(year)){
        return 29
    } else {
        return 28
    }
}

// monthTitle.innerHTML = (`${months[showCalendar.currentMonth].name} ${showCalendar.currentYear}`)

function validDateCheck(year,month, day){
    if(month === 2 && day <= febDays(year)){
        return true
    } else if( day <= months[month-1].days){
        return true
    }else {
        return false
    }   
}

console.log('date validitty check',validDateCheck(2021,2,29))


function firstWeekDay(month, year){
    let theFirstOfMonth = new Date(year, month, 1)
    let numberFirst = theFirstOfMonth.getDay()
    let theDaysIn = months[month].days
    const calzone = {
        daysInMonth: theDaysIn,
        firstDay: numberFirst,
    }
    return calzone
}
console.log(firstWeekDay(showCalendar.currentMonth, showCalendar.currentYear).firstDay)


//jan 2022: Sat Jan 01 2022 00:00:00 GMT-0800 (Pacific Standard Time) -> 6
// firstWeekDay(showCalendar.currentMonth, showCalendar.currentYear)

function getPrevMonthDates(month, startDate){
    let prevMonth = month > 0 ? month -1 : 11
    let prevMonthTotalDays = months[prevMonth].days
    let getDaysFrom = prevMonthTotalDays - startDate
    const days = []
    for(let i = getDaysFrom; i<= prevMonthTotalDays; i++){
        days.push(i)
    }
    // console.log(prevMonth)
    // console.log(months[prevMonth].days)
    // console.log(days)
    return days
}
getPrevMonthDates(showCalendar.currentMonth, firstWeekDay(showCalendar.currentMonth, showCalendar.currentYear).firstDay)


function getNextMonthDates(month){
    let nextMonth = month < 11 ? month + 1 : 0
    console.log(months[nextMonth].name)
    return nextMonth
}
// getNextMonthDates(showCalendar.currentMonth)

function createCalendar(month, year){
    let getCalZone = firstWeekDay(month, year)
}

