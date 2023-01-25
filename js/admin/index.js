import {
    createDailyReportRow,
    createRangeAdminRow, getAdminDailyReportData,
    getAdminRangeReportData,
} from "../modules/reports.js";
import {createPendingRow, getPendingEmployeeData} from "../modules/employeesTables.js";
import {checkIsAdmin, checkIsLogin, logout} from "../modules/auth.js";


document.addEventListener('DOMContentLoaded', function () {

    if (!checkIsLogin()){
        location.replace("./../login.html");
    }

    if (!checkIsAdmin()){
        $.toastr.error("UnAuthorized");
        location.replace("./../login.html");
    }

    $("#logout-link > a").click(function (e) {
        console.log("here")
        logout();
        location.replace("../../pages/login.html");
    })

    $("#daily-report-cont").hide();
    $("#full-report-cont").hide();
    $("#pending-employees-cont").show();
    $("#daily-report-link").click(function (e) {
        $("#full-report-cont").hide();
        $("#daily-report-cont").show();
        $("#pending-employees-cont").hide();
    });

    $("#full-report-link").click(function (e) {
        $("#daily-report-cont").hide();
        $("#full-report-cont").show();
        $("#pending-employees-cont").hide();

    });

    $('#pending-employees-link').click(function () {
        $("#daily-report-cont").hide();
        $("#full-report-cont").hide();
        $("#pending-employees-cont").show();
    });

    //All pending employees table
    getPendingEmployeeData()
        .then((data) => {
            data.forEach((user) => {
                createPendingRow(user);
            });
            $("#table_id").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
            }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
        });

    //Daily admin Report
    $("#daily-admin-id").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    document.getElementById("attendanceDate").addEventListener('change', function (e) {
            getAdminDailyReportData(e.target.value)
                .then((data) => {
                    $("#daily-admin-id").DataTable().clear().destroy();
                    if (data){
                        data.forEach((item) => {
                            createDailyReportRow(item, "daily-admin-id");
                        });
                    }
                    $("#daily-admin-id").DataTable({
                        "responsive": true, "lengthChange": false, "autoWidth": false
                    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
                });
    });

    // range admin report
    let month = new Date().getMonth()+1;
    month = month <= 9? `0${month}` : `${month}`;
    getAdminRangeReportData(`2023-${month}-01`, `2023-${month}-30`).then((data) => {
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
            getAdminRangeReportData(fromDateElm.value, toDateElm.value).then((data) => {
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