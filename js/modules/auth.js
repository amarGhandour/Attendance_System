function checkIsLogin() {
    return localStorage.getItem("user");
}
function checkIsAdmin() {
    const user = checkIsLogin();
    return !(!user || user.type !== 0);

}
function checkIsSecurity(){
    const user = checkIsLogin();
    return !(!user || user.type !== 1);
}
function checkIsApproved(){
    const user = checkIsLogin();
    return !(!user || !user.verify);
}

export {
    checkIsAdmin,
    checkIsApproved,
    checkIsLogin,
    checkIsSecurity
}