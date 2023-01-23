import {
    createDailyReportRow, createRangeEmployeeRow,
    getDailyReportDataForAUser,
    getRangeReportDataForAUser
} from "../modules/reports.js";
document.addEventListener('DOMContentLoaded', function (){

    // employee daily report
    let specifiedDateElm = document.getElementById('attendanceEmpDate');

    $("#daily-employee-id").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false, paging: false,
        ordering: false,
        info: false,filter:false
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

    specifiedDateElm.addEventListener('change', function (e){
        getDailyReportDataForAUser(1, e.target.value)
            .then((data) => {
                $("#daily-employee-id").DataTable().clear().destroy();
                if (data){
                    createDailyReportRow(data, "daily-employee-id");
                }
                $("#daily-employee-id").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false,
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            });
    });

    // employee range report
    let fromDateElm = document.getElementById("fromDate");
    fromDateElm.addEventListener("change", createAdminRangeTable);

    let toDateElm = document.getElementById("toDate");
    toDateElm.addEventListener("change", createAdminRangeTable);
    $("#range-employee-table").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        paging: false,
        ordering: false,
        info: false,
        filter: false
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

    function createAdminRangeTable(){
        if (fromDateElm.value !== '' && toDateElm.value !== ''){
            getRangeReportDataForAUser(1,fromDateElm.value, toDateElm.value).then((data) => {
                $("#range-employee-table").DataTable().clear().destroy();
                if (data)
                    createRangeEmployeeRow(data);

                $("#range-employee-table").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false,
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            });
        }
    }

});