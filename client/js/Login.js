let state = {
  email: "",
  password: "",
  isShowPassword: false,
};

document.getElementById("email").addEventListener("input", handleOnChangeEmail);
document
  .getElementById("password")
  .addEventListener("input", handleOnChangePassword);
document.getElementById("loginForm").addEventListener("submit", handleLogIn);

function handleOnChangeEmail(event) {
  state.email = event.target.value;
}

function handleOnChangePassword(event) {
  state.password = event.target.value;
}

async function handleLogIn(event) {
  event.preventDefault(); // Ngăn form gửi yêu cầu mặc định
  try {
    let response = await axios.post("http://localhost:8888/auth/login", {
      email: state.email,
      password: state.password,
    });
    let data = response.data;
    //console.log('Login response data:', data.user); // Thêm dòng này để kiểm tra dữ liệu trả về
    if (data === 0) {
      document.getElementById("loginResult").textContent = "Login Error";
    }
    if (data !== 0) {
      document.getElementById("loginResult").textContent = "Login successful!";
      sessionStorage.setItem("customer", JSON.stringify(data.user)); // Lưu thông tin người dùng vào sessionStorage
      window.location.href = "index-logined.html";
    }
  } catch (error) {
    if (error.response) {
      document.getElementById("loginResult").textContent = "Error";
    } else {
      console.error("Error:", error);
      document.getElementById("loginResult").textContent = state.errMessage;
    }
  }
}

function handleShowHidePassword() {
  state.isShowPassword = !state.isShowPassword;
  document.getElementById("password").type = state.isShowPassword
    ? "text"
    : "password";
}
