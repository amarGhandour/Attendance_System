
const domain = "http://localhost:3000";

async function getRangeAttendancesForAllUsers(fromDate, toDate) {
    let usersAttendances = await fetch(`${domain}/attendances?_expand=user&date_lte=${toDate}&date_gte=${fromDate}`);
    return await usersAttendances.json();
}

async function getADayAttendanceForAllUsers(date) {
    let usersAttendance = await fetch(`${domain}/attendances?_expand=user&date=${date}`);
    return await usersAttendance.json();
}

export {
    getRangeAttendancesForAllUsers,
    getADayAttendanceForAllUsers
};