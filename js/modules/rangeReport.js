import {calculateDiffTime, msToTime} from "./util.js";

const domain = "http://localhost:3000";
function isLate(time) {
    let lateTime = calculateDiffTime("8:30:00", msToTime(time));
    let latTimeArr = lateTime.split(":");

    return Number(latTimeArr[1]) > 0 ? true : Number(latTimeArr[0]) > 0;
}
function isExcuse(time) {
    let excuseTime = calculateDiffTime(msToTime(time),"15:30:00");
    let excuseTimeArr = excuseTime.split(":");

    return Number(excuseTimeArr[1]) > 0 ? true : Number(excuseTimeArr[0]) > 0;
}
function isAbsence(time) {

    let lateTime = calculateDiffTime("8:30:00", msToTime(time));
    let latTimeArr = lateTime.split(":");

    return Number(latTimeArr[1]) > 30 ? true : Number(latTimeArr[0]) > 0;
}

export default async function getReportData(fromDate, toDate) {
    const usersMap = new Map();
    let usersAttendances = await fetch(`${domain}/attendances?_expand=user&date_lte=${toDate}&date_gte=${fromDate}`);

    usersAttendances = await usersAttendances.json();

    usersAttendances.forEach((item) => {
        if (usersMap.has(item.userId)) {
            let userAttend = usersMap.get(item.userId);

            if (isAbsence(item.in))
                userAttend.absence++
            else {
                userAttend.attend++;
                if (isLate(item.in))
                    userAttend.late++;
                if (isExcuse(item.out))
                    userAttend.excuse++;
            }
        } else {
            let newRow = {
                late: 0,
                absence: 0,
                attend: 0,
                excuse: 0,
                name: `${item.user.firstName} ${item.user.lastName}`
            };


            if (isAbsence(item.in))
                newRow.absence++
            else {
                newRow.attend++;
                if (isLate(item.in))
                    newRow.late++;
                if (isExcuse(item.out))
                    newRow.excuse++;
            }
            usersMap.set(item.userId, newRow);
        }
    });
    return usersMap;
}

