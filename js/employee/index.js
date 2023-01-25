import {
    createDailyReportRow, createRangeEmployeeRow,
    getDailyReportDataForAUser,
    getRangeReportDataForAUser
} from "../modules/reports.js";
import {checkIsAdmin, checkIsApproved, checkIsLogin, checkIsSecurity, logout} from "../modules/auth.js";
import {formatDate} from "../modules/util.js";
document.addEventListener('DOMContentLoaded', function (){

    if (!checkIsLogin()){
        location.replace("./../login.html");
        return;
    }
    if (!checkIsApproved()){
        $.toastr.info("Please wait for admin accept.")
       setTimeout(() => {
           location.replace("./../login.html");
       }, 200);
        return;
    }

    if (!checkIsSecurity() && !checkIsAdmin()){
        $("#attendance-form-cont").hide();
        $("#range-employee-cont").hide();
        $("#daily-employee-cont").show();
    }else {
        $("#attendance-form-cont").show();
        $("#range-employee-cont").hide();
        $("#daily-employee-cont").hide();
    }


    $("#logout-link > a").click(function (e) {
        logout();
        location.replace("../../pages/login.html");
    })



    $("#daily-report-link").click(function (e) {
       $("#range-employee-cont").hide();
        $("#daily-employee-cont").show();
        $("#attendance-form-cont").hide();
    });

    $("#full-report-link").click(function (e) {
        $("#range-employee-cont").show();
        $("#daily-employee-cont").hide();
        $("#attendance-form-cont").hide();

    });

    $('#attendance-form-link').click(function () {
        $("#range-employee-cont").hide();
        $("#daily-employee-cont").hide();
        $("#attendance-form-cont").show();
    });

    // employee daily report
    let specifiedDateElm = document.getElementById('attendanceEmpDate');

    getDailyReportDataForAUser(1, formatDate())
        .then((data) => {
            specifiedDateElm.value = formatDate();
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
    specifiedDateElm.addEventListener('change', function (e){
        let userId = JSON.parse(localStorage.getItem('user'));
        getDailyReportDataForAUser(userId, e.target.value)
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
            let userId = JSON.parse(localStorage.getItem('user'));

            getRangeReportDataForAUser(userId,fromDateElm.value, toDateElm.value).then((data) => {
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