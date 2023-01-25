import {calculateDiffTime, msToTime} from "./util.js";
import {getAttendancesForAUser, getRangeAttendancesForAUser} from "./userService.js";
import {getADayAttendanceForAllUsers, getRangeAttendancesForAllUsers} from "./attendanceService.js";

const domain = "http://localhost:3000";

function isLate(time) {
    let lateTime = calculateDiffTime("8:30:00", msToTime(time));
    let latTimeArr = lateTime.split(":");

    return Number(latTimeArr[1]) > 0 ? true : Number(latTimeArr[0]) > 0;
}

function isExcuse(time) {
    let excuseTime = calculateDiffTime(msToTime(time), "15:30:00");
    let excuseTimeArr = excuseTime.split(":");

    return Number(excuseTimeArr[1]) > 0 ? true : Number(excuseTimeArr[0]) > 0;
}

function isAbsence(time) {

    if (time === 0)
        return true;

    let lateTime = calculateDiffTime("8:30:00", msToTime(time));
    let latTimeArr = lateTime.split(":");

    return Number(latTimeArr[1]) > 30 ? true : Number(latTimeArr[0]) > 0;
}

async function getDailyReportDataForAUser(userId, date) {
    let attendances = await getAttendancesForAUser(userId, date)

    if (!attendances.length)
        return null;
    return {
        name: `${attendances[0].user.firstName} ${attendances[0].user.lastName}`,
        date: attendances[0].date,
        late: calculateDiffTime("8:30:00", msToTime(attendances[0].in)),
        in: msToTime(attendances[0].in),
        out: msToTime(attendances[0].out),
        absent: isAbsence((attendances[0].in)),
        excuse: isExcuse(attendances[0].out)
    };
}

function createDailyReportRow(rowData, tableId) {
    let trElm = document.createElement('tr');

    trElm.innerHTML = `
                    <td>${rowData.name}</td>
                    <td>${rowData.date}</td>
                    <td>${rowData.in}</td>
                    <td>${rowData.out}</td>
                    <td>${rowData.late}</td>
                    <td>${rowData.excuse ? "YES" : "NO"}</td>
                    <td>${rowData.absent ? "YES" : "NO"}</td>
                `
    document.getElementById(tableId).children[1].appendChild(trElm);

}

async function getRangeReportDataForAUser(userId, startDate, endDate) {
    let attendances = await getRangeAttendancesForAUser(userId, startDate, endDate);

    if (!attendances.length)
        return null;
    const rangeData = {
        name: `${attendances[0].user.firstName} ${attendances[0].user.lastName}`,
        late: 0,
        absent: 0,
        excuse: 0,
        attend: 0
    };

    attendances.forEach((day) => {
        if (isAbsence(day.in))
            rangeData.absent++
        else {
            rangeData.attend++;
            if (isLate(day.in))
                rangeData.late++;
            if (isExcuse(day.out))
                rangeData.excuse++;
        }
    });

    return rangeData;
}

function createRangeEmployeeRow(rowData) {
    let trElm = document.createElement('tr');
    trElm.innerHTML =
        `<td>${rowData.name}</td>
                    <td>${rowData.attend}</td>
                    <td>${rowData.late}</td>
                    <td>${rowData.excuse}</td>
                    <td>${rowData.absent}</td>`

    document.getElementById('range-employee-table').children[1].appendChild(trElm);
}


async function getAdminRangeReportData(fromDate, toDate) {
    let usersAttendances = await getRangeAttendancesForAllUsers(fromDate, toDate);

    const usersMap = new Map();

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

function createRangeAdminRow(rowData) {
    let trElm = document.createElement('tr');
    trElm.innerHTML =
        `<td>${rowData.name}</td>
                    <td>${rowData.attend}</td>
                    <td>${rowData.late}</td>
                    <td>${rowData.excuse}</td>
                    <td>${rowData.absence}</td>`

    document.getElementById('range-admin-table').children[1].appendChild(trElm);
}

async function getAdminDailyReportData(date) {
    let attendances = await getADayAttendanceForAllUsers(date)

    if (!attendances.length)
        return null;
    let dailyData = [];

    attendances.forEach((attend) => {
        const item = {
            name: `${attend.user.firstName} ${attend.user.lastName}`,
            date: attend.date,
            late: calculateDiffTime("8:30:00", msToTime(attend.in)),
            in: msToTime(attend.in),
            out: msToTime(attend.out),
            absent: isAbsence((attend.in)),
            excuse: isExcuse(attend.out)
        };
        dailyData.push(item);
    })

    return dailyData;

}


export {
    getDailyReportDataForAUser,
    createDailyReportRow,
    getRangeReportDataForAUser,
    createRangeEmployeeRow,
    getAdminRangeReportData,
    createRangeAdminRow,
    getAdminDailyReportData
}