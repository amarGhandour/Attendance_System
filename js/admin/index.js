import {
    createDailyReportRow,
    createRangeAdminRow, getAdminDailyReportData,
    getAdminRangeReportData,
} from "../modules/reports.js";
import {createPendingRow, getPendingEmployeeData} from "../modules/employeesTables.js";


document.addEventListener('DOMContentLoaded', function () {
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