function msToTime(milli) {
    let time = new Date(milli);
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    let milliseconds = time.getUTCMilliseconds();
    return hours + ":" + minutes + ":" + seconds;
}

function getLateTime(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

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

function createRow(user) {
    let trElm = document.createElement('tr');
    trElm.innerHTML = `<tr>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
                <td>${user.type === 0 ? "Admin" : user.type === 1 ? "Security" : "Employee"}</td>
                <td>${user.verified ? "Accepted" : "Pending"}</td>
                <td>
                    ${!user.verified ? '<button type="button" id="approve' + user.id + '" class="btn btn-success" data-user-id="' + user.id + '" >&check;</button>' : ""}
                    <button type="button" id="delete` + user.id + `" class="btn btn-danger" data-user-id="` + `${user.id}` + `">X</button>
                    <button type="button" id="view" class="btn btn-info"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg></button>
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
    console.log(attendToday)
    if (attendToday) {
        let trElm = document.createElement('tr');
        let lateTime = getLateTime(msToTime(attendToday.in), msToTime(attendToday.out));

        trElm.innerHTML = `<tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${searchedDate}</td>
                    <td>${msToTime(attendToday.in)}</td>
                    <td>${msToTime(attendToday.out)}</td>
                    <td>${lateTime}</td>
                    <td>${Number(lateTime.slice(lateTime.length - 2)) > 30 ? "YES" : "NO"}</td>
                </tr>`
        document.getElementById('daily-admin-id').children[1].appendChild(trElm);
    }
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
            console.log(data);
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


const domain = "http://localhost:3000";

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
    //range Employees Report
    fetch(`${domain}/users?_embed=attendances&verified=true`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            data.forEach((row) => {
                createDailyAdminRow(row);
            });
            $("#range-admin-id").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
            }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
        });

    // $("#monthly-report").DataTable().draw();
})