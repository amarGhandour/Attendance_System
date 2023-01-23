import {createDailyEmployeeRow, getDailyReportDataForAUser} from "../modules/dailyReport.js";
document.addEventListener('DOMContentLoaded', function (){

    // employee daily report
    let specifiedDateElm = document.getElementById('attendanceEmpDate');

    $("#daily-employee-id").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

    specifiedDateElm.addEventListener('change', function (e){
        getDailyReportDataForAUser(1, e.target.value)
            .then((data) => {
                $("#daily-employee-id").DataTable().clear().destroy();
                if (data){
                    createDailyEmployeeRow(data);
                }
                $("#daily-employee-id").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false,
                    "search": false,
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            });
    });

});