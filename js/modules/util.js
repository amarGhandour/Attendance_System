 function msToTime(milli) {
    let time = new Date(milli);
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
}

 function calculateDiffTime(start, end) {

    start = start.split(":");
    end = end.split(":");

    if (+start[0] > +end[0])
        return "00:00";
    else if (+start[1] > +end[1])
        return "00:00";

    let startDate = new Date(0, 0, 0, start[0], start[1], 0);
    let endDate = new Date(0, 0, 0, end[0], end[1], 0);
    let diff = endDate.getTime() - startDate.getTime();
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
        hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

 function formatDate(date) {
    let d = null;

    if (arguments.length)
        d = new Date(date);
    else
        d = new Date();
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export { formatDate, calculateDiffTime, msToTime };


