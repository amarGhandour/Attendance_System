import {approveAUser, deleteUser, getAllPendingUsers} from "./userService.js";

async function getPendingEmployeeData(){
    let pendingUsers = await getAllPendingUsers();

    let pendingData = [];
    pendingUsers.forEach((user)=> {
        let obj = {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            age: user.age,
            position: user.type === 0 ? "Admin" : user.type === 1 ? "Security" : "Employee",
            status: user.verified ? "Accepted" : "Pending"
        }
        pendingData.push(obj);
    });

    return pendingData;
}

function createPendingRow(user) {
    let trElm = document.createElement('tr');
    trElm.innerHTML = `<tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
                <td>${user.position}</td>
                <td>${user.status}</td>
                <td>
                    <button type="button" id="approve` + user.id + `" class="btn btn-success" data-user-id="` + user.id + `" >&check;</button>
                    <button type="button" id="delete` + user.id + `" class="btn btn-danger" data-user-id="` + user.id + `">X</button>
                </td>
            </tr>`

    document.getElementById('table_id').children[1].appendChild(trElm);

    document.getElementById("approve" + user.id).addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm("Are you sure")) {
            approveAUser(e.target.getAttribute('data-user-id')).then((data) => {
                $('#table_id').DataTable()
                    .rows($(e.target.parentElement.parentElement))
                    .remove()
                    .draw();
            });
        }
        return false;
    });

    document.getElementById("delete" + user.id).addEventListener('click', function (e) {
        if (confirm("Are you sure")) {
            deleteUser(e.target.getAttribute('data-user-id'))
                .then((data) => {
                    e.target.parentElement.parentElement.remove();
                });
        }
    });
}

export {getPendingEmployeeData, createPendingRow};