const domain = "http://localhost:3000";

function msToTime(milli) {
    let time = new Date(milli);
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
}

function getLateTime(start, end) {

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


function isExcuse(time) {
    let excuseTime = getLateTime(msToTime(time),"15:30:00");
    let excuseTimeArr = excuseTime.split(":");

    return Number(excuseTimeArr[1]) > 0 ? true : Number(excuseTimeArr[0]) > 0;
}

function isLate(time) {
    let lateTime = getLateTime("8:30:00", msToTime(time));
    let latTimeArr = lateTime.split(":");

    return Number(latTimeArr[1]) > 0 ? true : Number(latTimeArr[0]) > 0;
}

function isAbsence(time) {

    let lateTime = getLateTime("8:30:00", msToTime(time));
    let latTimeArr = lateTime.split(":");

   return Number(latTimeArr[1]) > 30 ? true : Number(latTimeArr[0]) > 0;
}

function createRow(user) {
    let trElm = document.createElement('tr');
    trElm.innerHTML = `<tr>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
                <td>${user.type === 0 ? "Admin" : user.type === 1 ? "Security" : "Employee"}</td>
                <td>${user.verified ? "Accepted" : "Pending"}</td>
                <td>
                    <button type="button" id="approve` + user.id + `" class="btn btn-success" data-user-id="` + user.id + `" >&check;</button>
                    <button type="button" id="delete` + user.id + `" class="btn btn-danger" data-user-id="` + user.id + `">X</button>
                </td>
            </tr>`

    document.getElementById('table_id').children[1].appendChild(trElm);
    document.getElementById("approve" + user.id).addEventListener('click', function (e) {
        e.preventDefault();

        if (confirm("Are you sure")) {
            let body = {verified: true};
            fetch(`${domain}/users/${e.target.getAttribute('data-user-id')}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "PATCH",
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((data) => {
                    $('#table_id').DataTable()
                        .rows($(e.target.parentElement.parentElement))
                        .remove()
                        .draw();
                });
        }
        return false;
    });
    document.getElementById("delete" + user.id).addEventListener('click', deleteUser);
}

function createDailyAdminRow(user) {
    let date = new Date();

    let searchedDate = null;
    if (arguments.length === 1)
        searchedDate = formatDate();
    else {
        searchedDate = arguments[1];
    }

    let attendToday = user.attendances.find((attend) => {
        return attend.date === searchedDate
    });
    if (attendToday) {
        let trElm = document.createElement('tr');
        let lateTime = getLateTime("8:30:00",msToTime(attendToday.in));
        let lateTimeArr = lateTime.split(":");

        trElm.innerHTML = `<tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${searchedDate}</td>
                    <td>${msToTime(attendToday.in)}</td>
                    <td>${msToTime(attendToday.out)}</td>
                    <td>${lateTime}</td>
                    <td>${Number(lateTimeArr[1]) > 30 ? "YES" : Number(lateTimeArr[0]) > 0? "YES" : "NO" }</td>
                </tr>`
        document.getElementById('daily-admin-id').children[1].appendChild(trElm);
    }
}

async function getRangeDataTable(fromDate, toDate) {
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

function createRangeAdminRow(row) {
    let trElm = document.createElement('tr');
        trElm.innerHTML =
                    `<td>${row.name}</td>
                    <td>${row.attend}</td>
                    <td>${row.late}</td>
                    <td>${row.excuse}</td>
                    <td>${row.absence}</td>`

        document.getElementById('range-admin-table').children[1].appendChild(trElm);
}


function deleteUser(e) {
    if (confirm("Are you sure")) {
        fetch(`${domain}/users/${e.target.getAttribute('data-user-id')}`, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then((data) => {
                e.target.parentElement.parentElement.remove();
            });
    }
}

function createDailyReport() {

    fetch(`${domain}/users?_embed=attendances&verified=true`)
        .then((res) => res.json())
        .then((data) => {
            if (arguments.length === 1) {
                $("#daily-admin-id").DataTable().clear().destroy();

                data.forEach((row) => {
                    createDailyAdminRow(row, arguments[0]);
                });

                $("#daily-admin-id").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false,
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            } else {
                data.forEach((row) => {
                    createDailyAdminRow(row);
                });
                $("#daily-admin-id").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false,
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            }
        });
}


document.addEventListener('DOMContentLoaded', function () {

    //All Employees
    fetch(`${domain}/users?verified=false`)
        .then((res) => res.json())
        .then((data) => {
            data.forEach((user) => {
                createRow(user);
            });
            $("#table_id").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
            }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
        });

    //Daily Employees Report
    createDailyReport();
    document.getElementById("attendanceDate").addEventListener('change', function (e) {
        createDailyReport(e.target.value);
    });

    // range admin report
    let month = new Date().getMonth()+1;
    month = month <= 9? `0${month}` : `${month}`;
    getRangeDataTable(`2023-${month}-01`, `2023-${month}-30`).then((data) => {
        data.forEach((row) => {
            createRangeAdminRow(row);
        });
        $("#range-admin-table").DataTable({
            "responsive": true, "lengthChange": false, "autoWidth": false,
        }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    });


    let fromDateElm = document.getElementById("fromDate");
    fromDateElm.addEventListener("change", createAdminRangeTable);

    let toDateElm = document.getElementById("toDate");
    toDateElm.addEventListener("change", createAdminRangeTable);
    function createAdminRangeTable(){
        if (fromDateElm.value != '' && toDateElm.value != ''){
            getRangeDataTable(fromDateElm.value, toDateElm.value).then((data) => {
                $("#range-admin-table").DataTable().clear().destroy();
                data.forEach((row) => {
                    createRangeAdminRow(row);
                });
                $("#range-admin-table").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false,
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            });
        }
    }
});