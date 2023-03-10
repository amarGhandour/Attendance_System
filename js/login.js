import {checkIsApproved} from "./modules/auth.js";

document.addEventListener('DOMContentLoaded', function () {
    (() => {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })();

    const formLoginElm = document.querySelector(".form-login");
    formLoginElm.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!formLoginElm.checkValidity())
            return;

        const formUsernameElm = document.getElementById('Username');
        const formPassElm = document.getElementById('Password');

        // submit fields and check authentication
        fetch(`http://localhost:3000/users?username=${formUsernameElm.value}&password=${formPassElm.value}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length === 1 && data[0].username === formUsernameElm.value && data[0].password === formPassElm.value) {
                    localStorage.setItem("user", JSON.stringify({
                        id: data[0].id,
                        verify: data[0].verified,
                        type: data[0].type
                    }));

                    if (!checkIsApproved()){
                        $.toastr.info("Please wait for admin accept.", {
                            position: 'right-bottom'
                        });
                    } else {
                        $.toastr.success(`Welcome ${data[0].firstName}`, {
                            position: 'right-bottom'
                        });

                        setTimeout(() => {
                            switch (data[0].type) {
                                case 0:
                                    location.replace("./../pages/admin/index.html");
                                    break;
                                case 1:
                                    location.replace("./../pages/security/take_attendance.html");
                                    break;
                                case 2:
                                    location.replace("./../pages/employee/index.html");
                                    break;
                            }
                        }, 200);
                    }

                } else {
                    $.toastr.error('Invalid username or password', {
                        position: 'right-bottom'
                    });
                }
            });
    });
});







