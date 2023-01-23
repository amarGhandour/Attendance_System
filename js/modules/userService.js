const domain = "http://localhost:3000";

async function getAttendancesForAUser(userId, date = null) {

    let url = `${domain}/users/${userId}/attendances?_expand=user`;
    if (date) {
        url += `&date=${date}`;
    }
    let userAttendancesJson = await fetch(url);
    return await userAttendancesJson.json();
}

async function getRangeAttendancesForAUser(userId, startDate, endDate) {
    let url = `${domain}/users/${userId}/attendances?_expand=user&date_gte=${startDate}&date_lte=${endDate}`;

    let userAttendancesJson = await fetch(url);
    return await userAttendancesJson.json();
}

async function deleteUser(userId) {
    let res = await fetch(`${domain}/users/${userId}`, {
        method: "DELETE"
    });
    return res.json();
}

async function approveAUser(userId) {
    let body = {verified: true};
    let res = await fetch(`${domain}/users/${userId}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(body)
    });

    return await res.json();
}

async function getAllPendingUsers(){
    let response = await fetch(`${domain}/users?verified=false`)
    return await response.json();
}

export {
    getAttendancesForAUser,
    getRangeAttendancesForAUser,
    deleteUser,
    approveAUser,
    getAllPendingUsers
};