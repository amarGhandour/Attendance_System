import * as dateTimeUtil from "./../modules/util.js"
import getReportData from "../modules/rangeReport.js";
const domain = "http://localhost:3000";

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
        searchedDate = dateTimeUtil.formatDate();
    else {
        searchedDate = arguments[1];
    }

    let attendToday = user.attendances.find((attend) => {
        return attend.date === searchedDate
    });
    if (attendToday) {
        let trElm = document.createElement('tr');
        let lateTime = dateTimeUtil.calculateDiffTime("8:30:00",dateTimeUtil.msToTime(attendToday.in));
        let lateTimeArr = lateTime.split(":");

        trElm.innerHTML = `<tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${searchedDate}</td>
                    <td>${dateTimeUtil.msToTime(attendToday.in)}</td>
                    <td>${dateTimeUtil.msToTime(attendToday.out)}</td>
                    <td>${lateTime}</td>
                    <td>${Number(lateTimeArr[1]) > 30 ? "YES" : Number(lateTimeArr[0]) > 0? "YES" : "NO" }</td>
                </tr>`
        document.getElementById('daily-admin-id').children[1].appendChild(trElm);
    }
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
    getReportData(`2023-${month}-01`, `2023-${month}-30`).then((data) => {
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
            getReportData(fromDateElm.value, toDateElm.value).then((data) => {
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