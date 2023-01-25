// document.querySelector('#FirstName').addEventListener('blur', validateName);
// document.querySelector('#FirstName').addEventListener('keyup', validateName);
//
// document.querySelector('#LastName').addEventListener('blur', validateName);
// document.querySelector('#LastName').addEventListener('keyup', validateName);
//
// document.querySelector('#Email').addEventListener('blur', validateEmail);
// document.querySelector('#Email').addEventListener('keyup', validateEmail);
const domain = "http://localhost:3000";

function sendEmail(_username, _password, toEmail) {
    let templateParams = {
        username: _username,
        password: _password,
        email_to: toEmail
    };
    emailjs.send('service_tnqlnh6', 'template_3b8e5pg', templateParams)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
            console.log('FAILED...', error);
        });
}


const registerFormElm = document.querySelector('.form-register');

function checkValidity(formData) {

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const age = formData.get('age');

    const namePattern = /([A-Za-z]{4,8})/;

    if (!firstName || !namePattern.test(firstName)) {
        document.getElementById('FirstName').classList.add('is-invalid');
    }

    if (!lastName || !namePattern.test(lastName)) {
        document.getElementById('LastName').classList.add('is-invalid');
    }

    const agePattern = /^(?:1[7-9]|[2-5][0-9])$/;
    if (!age || !agePattern.test(age)) {
        document.getElementById('Age').classList.add('is-invalid');
    }

    const emailPattern = /^([a-zA-Z0-9_\-?\.?]){3,}@([a-zA-Z]){3,}\.([a-zA-Z]){2,5}$/;
    if (!email || !emailPattern.test(email)) {
        document.getElementById('Email').classList.add('is-invalid');
    }

    const allInvalidElms = document.querySelectorAll('.is-invalid');

    if (allInvalidElms.length) {
        allInvalidElms.forEach(function (elm) {
            elm.addEventListener('input', function () {
                this.classList.remove('is-invalid');
            });
        })
        return false;
    }

    return true;
}

registerFormElm.addEventListener('submit', function (e) {
    e.preventDefault();

    // validate form data
    const formData = new FormData(registerFormElm);
    const isValid = checkValidity(formData);

    if (!isValid) {
        return;
    }

    // validate if email is unique
    fetch(`${domain}/users?email=${formData.get('email')}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length) {
                document.getElementById('Email').classList.add('is-invalid');
                document.getElementById('Email').nextElementSibling.nextElementSibling.innerText = 'email is exist';
            } else {
                // collect data from form to send it to server as json.
                const object = {};
                formData.forEach(function (value, key) {
                    object[key] = value;
                });
                // create random username
                fetch('https://api.api-ninjas.com/v1/passwordgenerator?length=8', {
                    method: "GET",
                    headers: {'X-Api-Key': 'M+0QmqdJqLpx1vwhwuPQ7g==4p6mSBME34oNYBT3'},
                    contentType: 'application/json',
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        object['username'] = data.random_password;
                        console.log(data)
                        object['password'] = "iti43";
                        object['verified'] = false;
                        object['type'] = 2;

                        // make a post request by ajax to create a user
                        const json = JSON.stringify(object);

                        fetch(`${domain}/users`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: "POST",
                            body: json
                        }).then((res) => {
                            return res.json();
                        }).then((user) => {
                            // send email to user contain his username and password
                            sendEmail(user.username, user.password, user.email);
                            console.log("here")
                            $.toastr.info('Please check your Email', {
                                position: 'right-bottom'
                            });
                            setTimeout(() => {
                                location.replace("../../pages/login.html")
                            }, 2000);
                            // redirect user to home page. // home page contain button to show daily report and monthly.
                        }).catch((res) => {
                            console.log(res);
                            $.toastr.error('unexpected error occur.  try again', {
                                position: 'right-bottom'
                            });
                        })
                    }).catch((res) => {
                    $.toastr.error('unexpected error occur.  try again', {
                        position: 'right-bottom'
                    });
                });

            }
        });
});
