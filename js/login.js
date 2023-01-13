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
    formLoginElm.addEventListener('submit', function (e){
        e.preventDefault();
        e.stopPropagation();

        if (!formLoginElm.checkValidity())
            return;

        const formUsernameElm = document.getElementById('Username');
        const formPassElm = document.getElementById('Password');

        console.log(formUsernameElm)
        // submit fields and check authentication
        fetch(`http://localhost:3000/users?username=${formUsernameElm.value}&password=${formPassElm.value}`)
            .then((res)=> res.json())
            .then((data)=> {
                if (data.length === 1 && data[0].username === formUsernameElm.value && data[0].password === formPassElm.value){
                    localStorage.setItem("user", JSON.stringify(data[0]));
                    formLoginElm.submit();
                }else{
                    document.querySelector('.invalid-login').classList.remove('d-none');
                }
            });
    });



});







