import {calculateDiffTime, msToTime} from "./util.js";
import {getAttendancesForAUser} from "./userService.js";

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
        late: calculateDiffTime("8:30:00",msToTime(attendances[0].in)),
        in: msToTime(attendances[0].in),
        out: msToTime(attendances[0].in),
        absent: isAbsence((attendances[0].in)),
        excuse: isExcuse(attendances[0].out)
    };
}

function createDailyEmployeeRow(rowData) {
    let trElm = document.createElement('tr');

    trElm.innerHTML = `
                    <td>${rowData.name}</td>
                    <td>${rowData.date}</td>
                    <td>${rowData.in}</td>
                    <td>${rowData.out}</td>
                    <td>${rowData.late}</td>
                    <td>${rowData.excuse? "YES" : "NO" }</td>
                    <td>${rowData.absent? "YES" : "NO" }</td>
                `
    document.getElementById('daily-employee-id').children[1].appendChild(trElm);

}

export {getDailyReportDataForAUser, createDailyEmployeeRow}