document.addEventListener("DOMContentLoaded", async function () {
  // Gọi API để lấy thông tin user
  const customerData = JSON.parse(sessionStorage.getItem("customer"));
  axios
    .get("http://localhost:8888/users/profile", {
      params: {
        id_user: customerData.id_user,
      },
    })
    .then((response) => {
      const user = response.data;
      loadCustomerData(user);
    })
    .catch((error) => console.error("User not found", error));
});

function loadCustomerData(userProfile) {
  if (!userProfile) {
    console.error("User not found");
    return;
  }
  document.getElementById("full_name").textContent = userProfile.full_name || "asas";
  document.getElementById("email").textContent = userProfile.email || "asas";
  document.getElementById("birth_date").textContent = userProfile.birth_date || "asas";
  document.getElementById("join_date").textContent = userProfile.join_date || "asas";
  document.getElementById("current_location").textContent =
    userProfile.current_location || "asas";
  document.getElementById("phone_number").textContent =
    userProfile.phone_number || "";
  document.getElementById("desired_payrate").textContent =
    userProfile.join_date || "";
  document.getElementById("available_time_per_week").textContent =
    userProfile.join_date || "";
}
function logout() {
  sessionStorage.clear();
  alert("Bạn đã đăng xuất thành công!");
  window.location.href = "../index.html"; // Redirect to home page after logout
}
