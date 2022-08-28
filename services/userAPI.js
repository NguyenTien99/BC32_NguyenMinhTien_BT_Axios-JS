// lấy dữ liệu api
function apiGetUsers(searchTemp){
    return axios({
        url:"https://62f50938535c0c50e76847ad.mockapi.io/users",
        method:"GET",
        params: {
            hoTen : searchTemp
        },
    });
}

// api thêm mới User
function apiAddUsers(user){
    return axios({
        url:"https://62f50938535c0c50e76847ad.mockapi.io/users",
        method: "POST",
        // cần thêm key data chứa dữ liệu server để tạo mới
        data: user,
    });
}

// xóa
function apiDeleteUsers(userId){
    return axios({
        url:`https://62f50938535c0c50e76847ad.mockapi.io/users/${userId}`,
        method: "DELETE",
    });
}

// lấy thông tin 1 dữ liệu
function apiGetUsersById(userId){
    return axios({
        url:`https://62f50938535c0c50e76847ad.mockapi.io/users/${userId}`,
        method: "GET",
    });
}

//update User
function apiUpdateUsers(userId, user){
    console.log(userId, user)
    return axios({
        url:`https://62f50938535c0c50e76847ad.mockapi.io/users/${userId}`,
        method: "PUT",
        data: user,
    });
}

function apiCheckUser(){
    return axios({
        url:"https://62f50938535c0c50e76847ad.mockapi.io/users",
        method:"GET",
    })
}