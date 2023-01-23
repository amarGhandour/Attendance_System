
const domain = "http://localhost:3000";

async function getAttendancesForAUser(userId, date = null) {

    let url = `${domain}/users/${userId}/attendances?_expand=user`;
    if (date){
        url += `&date=${date}`;
    }
    console.log(url);
    let userAttendancesJson = await fetch(url);
    return await userAttendancesJson.json();
}


async function getRangeAttendancesForAUser(userId, startDate, endDate ) {

    let url = `${domain}/users/${userId}/attendances?_expand=user&date_gte=${startDate}&date_lte=${endDate}`;

    let userAttendancesJson = await fetch(url);
    return await userAttendancesJson.json();
}

export {getAttendancesForAUser, getRangeAttendancesForAUser};