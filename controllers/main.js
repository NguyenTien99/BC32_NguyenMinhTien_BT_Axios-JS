// function getUsers request API lấy danh sách sản phẩm
let users = [];
getUsers();

function getUsers(searchTemp) {
  apiGetUsers(searchTemp)
    .then((response) => {
      // console.log("API", response.data);
      // Duyệt qua danh sách và tạo đối tượng User
      users = response.data.map((user) => {
        return new User(
          user.id,
          user.taiKhoan,
          user.hoTen,
          user.matKhau,
          user.email,
          user.hinhAnh,
          user.loaiND,
          user.ngonNgu,
          user.moTa
        );
      });
      // Hiển thị
      display(users);
    })
    .catch((error) => {
      console.log(error);
    });
}
console.log("tem2",users);
function addUsers(user) {
  apiAddUsers(user)
    .then(() => {
      // dữ liệu chỉ thêm mới ở server cần gọi lại getUsers để lấy dữ liệu mới vừa thêm
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteUsers(userId) {
  apiDeleteUsers(userId)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      {
        console.log(error);
      }
    });
}

function updateUsers(userId, user) {
  apiUpdateUsers(userId, user)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}

let usersdata = [];
let usersnew = [];
function checkUsers(account) {
  apiCheckUser()
    .then((response) => {
       usersdata = response.data;
       usersnew = response.data.filter((user) => {
        return user.taiKhoan !== account;
      });
      
    })
    .catch((error) => {
      console.log(error);
    });
}


//===============================================
// nhận vào arrat user
function display(users) {
  let output = users.reduce((result, user, index) => {
    return (
      result +
      `
        <tr>
            <td>${index + 1}</td>
            <td>${user.taiKhoan}</td>
            <td>${user.matKhau}</td>
            <td>${user.hoTen}</td>
            <td>${user.email}</td>
            <td>${user.ngonNgu}</td>
            <td>${user.loaiND}</td>
            <td>
                <button class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-type="edit" data-id="${
                  user.id
                }">Sửa</button>
                <button class="btn btn-danger" data-type="delete" data-id="${
                  user.id
                }">Xóa</button>
            </td>
        </tr>
        `
    );
  }, "");

  dom("#tblDanhSachNguoiDung").innerHTML = output;
}

function dom(selector) {
  return document.querySelector(selector);
}

function resetForm() {
  dom("#maId").value = "";
  dom("#TaiKhoan").value = "";
  dom("#HoTen").value = "";
  dom("#MatKhau").value = "";
  dom("#Email").value = "";
  dom("#HinhAnh").value = "";
  dom("#loaiNguoiDung").value = "";
  dom("#loaiNgonNgu").value = "";
  dom("#MoTa").value = "";

}

function resetspan(){
  dom("#spanTK").innerHTML = "";
  dom("#spanName").innerHTML = "";
  dom("#spanPW").innerHTML = "";
  dom("#spanEmail").innerHTML = "";
  dom("#spanImage").innerHTML = "";
  dom("#spanLoaiND").innerHTML = "";
  dom("#spanNgonNgu").innerHTML = "";
  dom("#spanMota").innerHTML = "";

  dom("#spanTK").classList.remove("d-block");
  dom("#spanName").classList.remove("d-block");
  dom("#spanPW").classList.remove("d-block");
  dom("#spanEmail").classList.remove("d-block");
  dom("#spanImage").classList.remove("d-block");
  dom("#spanLoaiND").classList.remove("d-block");
  dom("#spanNgonNgu").classList.remove("d-block");
  dom("#spanMota").classList.remove("d-block");
}
//===================================================
// lắng nghe sự kiện click Thêm mới
dom("#btnThemNguoiDung").addEventListener("click", () => {
  dom(".modal-title").innerHTML = "Thêm người dùng";
  dom(".modal-footer").innerHTML = `
    <button class="btn btn-danger" data-dismiss="modal">Hủy</button>
    <button class="btn btn-success" data-type="add">Thêm</button>
    `;

  resetForm();
  resetspan();
});

// lắng nghe sự kiện Thêm ở modal-footer
dom(".modal-footer").addEventListener("click", (evt) => {
  // console.log(evt.target.innerHTML === "Thêm");
  let elementType = evt.target.getAttribute("data-type");

  //DOM
  let id = dom("#maId").value;
  let taiKhoan = dom("#TaiKhoan").value;
  let hoTen = dom("#HoTen").value;
  let matKhau = dom("#MatKhau").value;
  let email = dom("#Email").value;
  let image = dom("#HinhAnh").value;
  let loaiND = dom("#loaiNguoiDung").value;
  let ngonNgu = dom("#loaiNgonNgu").value;
  let moTa = dom("#MoTa").value;

  let isvalid = validateForm();
  if (!isvalid) {
    return;
  }

  // Tạo object từ lớp đối tương User (id phía server tự động nên để null)
  let user = new User(
    null,
    taiKhoan,
    hoTen,
    matKhau,
    email,
    image,
    loaiND,
    ngonNgu,
    moTa
  );
  
  // usersTemp = usersTemp.push(user);
  if (elementType === "add") {
    addUsers(user);
  } else if (elementType === "update") {
    updateUsers(id, user);
    console.log(id);
  }
  
});



// Lắng nghe sự kiện nguyên bảng tblNguoiDung
dom("#tblNguoiDung").addEventListener("click", (evt) => {
  // console.log(evt.target)
  let elementType = evt.target.getAttribute("data-type");
  let id = evt.target.getAttribute("data-id");

  if (elementType === "delete") {
    deleteUsers(id);
  } else if (elementType === "edit") {
    // thay đổi hiển thị
    dom(".modal-title").innerHTML = "Cập nhật người dùng";
    dom(".modal-footer").innerHTML = `
    <button class="btn btn-danger" data-dismiss="modal">Hủy</button>
    <button class="btn btn-success" data-type="update">Cập nhật</button>
    `;
    // call api get /:id để lấy chi tiết thông tin 1 dữ liệu
    apiGetUsersById(id)
      .then((response) => {
        let user = response.data;

        //fill thông tin lên input
        dom("#maId").value = user.id;
        dom("#TaiKhoan").value = user.taiKhoan;
        dom("#HoTen").value = user.hoTen;
        dom("#MatKhau").value = user.matKhau;
        dom("#Email").value = user.email;
        dom("#HinhAnh").value = user.hinhAnh;
        dom("#loaiNguoiDung").value = user.loaiND;
        dom("#loaiNgonNgu").value = user.ngonNgu;
        dom("#MoTa").value = user.moTa;

        resetspan();
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

dom("#search").addEventListener("keydown", (evt) => {
  // console.log(evt.key);

  // Kiểm tra không phải kí tự Enter kết thúc hàm
  if (evt.key !== "Enter") return;

  getUsers(evt.target.value);
});

// Validation

function validataAccount() {
  let account = dom("#TaiKhoan").value;
  let spanEl = dom("#spanTK");

  if (!account) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Tài khoản không được để trống";
    return false;
  }

  checkUsers(account);
  if(usersdata !== usersnew){
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Tài khoản đã có";
    return false;
  }
  console.log("usersdata",usersdata)
  console.log("users",usersnew)

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}
// console.log("validataAccount()",validataAccount())
function validateName() {
  let name = dom("#HoTen").value;
  let spanEl = dom("#spanName");

  if (!name) {
    spanEl.innerHTML = "Họ Tên không được để trống";
    return false;
  }

  let regex =
    /^[a-zA-Z'-'\sáàảãạăâắằấầặẵẫậéèẻ ẽẹêếềểễệóòỏõọôốồổỗộ ơớờởỡợíìỉĩịđùúủũụưứ ửữựÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠ ƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼ ÊỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞ ỠỢỤỨỪỬỮỰỲỴÝỶỸửữựỵ ỷỹ]*$/;
  if (!regex.test(name)) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Họ Tên phải là chữ";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validPassword() {
  let password = dom("#MatKhau").value;
  let spanEl = dom("#spanPW");

  if (!password) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Mật khẩu không được để trống";
    return false;
  }

  let regex =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,8}$/;
  if (!regex.test(password)) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML =
      "Mật khẩu có ít nhất 1 ký tự hoa, 1 ký tự đặc biệt, 1 ký tự số, độ dài 6-8";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validEmail() {
  let email = dom("#Email").value;
  let spanEl = dom("#spanEmail");

  if (!email) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Email không được để trống";
    return false;
  }

  let regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Email không đúng định dạng";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validImage() {
  let image = dom("#HinhAnh").value;
  let spanEl = dom("#spanImage");

  if (!image) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Hình ảnh không được để trống";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validLoaiND() {
  let loaiND = dom("#loaiNguoiDung").value;
  let spanEl = dom("#spanLoaiND");

  if (!loaiND) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Loại người dùng phải chọn";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validNgonNgu() {
  let language = dom("#loaiNgonNgu").value;
  let spanEl = dom("#spanNgonNgu");

  if (!language) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Loại ngôn ngữ phải chọn";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validMota() {
  let mota = dom("#MoTa").value;
  let spanEl = dom("#spanMota");

  if (!mota) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Mô tả không được để trống";
    return false;
  }

  if (mota.length > 60) {
    spanEl.classList.add("d-block");
    spanEl.innerHTML = "Mô tả không được vượt qua 60 kí tự";
    return false;
  }

  spanEl.classList.remove("d-block");
  spanEl.innerHTML = "";
  return true;
}

function validateForm() {
  let isvalid = true;
  isvalid =
    validataAccount() &
    validateName() &
    validPassword() &
    validEmail() &
    validImage() &
    validLoaiND() &
    validNgonNgu() &
    validMota();
  console.log("validataAccount() sau: ", validataAccount());
  if (!isvalid) {
    alert("Form không hợp lệ");
    return false;
  }

  return true;
}

console.log("tem2",users);
console.log("usersdata",usersdata);
console.log("users",users);

