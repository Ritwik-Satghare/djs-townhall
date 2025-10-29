function convertToDateFormat(date, time){
    const[day, month, year] = date.split("-").map(Number);
    const[hour, min, sec] = time.split(":").map(Number);

    const dateTime = new Date(year, month - 1, day, hour, min, sec);

    return dateTime;
}

module.exports = {convertToDateFormat};