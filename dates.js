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

module.exports = calculateAge()