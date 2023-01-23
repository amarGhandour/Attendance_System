import {formatDate} from "./util.js";

const domain = "http://localhost:3000";

async function getRangeAttendancesForAllUsers(fromDate, toDate) {
    let usersAttendances = await fetch(`${domain}/attendances?_expand=user&date_lte=${toDate}&date_gte=${fromDate}`);
    return await usersAttendances.json();
}

async function getADayAttendanceForAllUsers(date) {
    let usersAttendance = await fetch(`${domain}/attendances?_expand=user&date=${date}`);
    return await usersAttendance.json();
}

async function setLeaveTimeForUsers() {
    let usersAttendances = await fetch(`${domain}/attendances?_expand=user&date=${formatDate()}&out=0`);
    usersAttendances = await usersAttendances.json();

    if (usersAttendances.length) {
        usersAttendances.forEach((attend) => {
            let today = new Date();
            today.setHours(3, 30);
            fetch(`${domain}/attendances/${attend.id}`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({out: today.getTime()})
                }
            );
        })
    }
}

async function setAbsentForAllUsersNotAttend() {
    let attendances = await fetch(`${domain}/attendances?_expand=user&date=${formatDate()}`);
    attendances = await attendances.json();

    let usersIds = [];
    if (attendances.length) {
        attendances.forEach((attend) => {
            usersIds.push(attend.userId);
        });
    }
    let url = `${domain}/users?verified=true`;
    if (usersIds.length) {
        usersIds.forEach((id, index) => {
            url += `id_ne=${id}`
            if (index !== usersIds.length - 1) {
                url += `&`;
            }
        })
    }
    console.log(url);

    let users = await fetch(url);
    users = await users.json();

    console.log(users);

    if (users.length) {
        users.forEach((user)=> {
            setTimeout(()=> {
                fetch(`${domain}/users/${user.id}/attendances`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({in: 0, out: 0, date: formatDate()})
                    }
                );

            }, 100)
        })
    }
}

export {
    getRangeAttendancesForAllUsers,
    getADayAttendanceForAllUsers,
    setAbsentForAllUsersNotAttend,
    setLeaveTimeForUsers
};