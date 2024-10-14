document.addEventListener("DOMContentLoaded", function () {
  // Gọi API để lấy danh sách datasets
  const customerData = JSON.parse(sessionStorage.getItem("customer"));
  axios
    .get("http://localhost:8888/yourwork",{
      params: {
        id_user: customerData.id_user,
      },
    })
    .then((response) => {
      const datasets = response.data.items; // Truy cập vào mảng datasets trong key 'items'
      renderOwnedDatasets(datasets);
    })
    .catch((error) => console.error("Error fetching datasets:", error));

    axios
    .get("http://localhost:8888/users/reliability", {
      params: {
        id_user: customerData.id_user,
      },
    })
    .then((response) => {
      const user = response.data;
      //console.log(user.reliability);
      loadUserReliability(user);
    })
    .catch((error) => console.error("User reliability not found", error));
});

function renderOwnedDatasets(datasets) {
  const datasetsContainer = document.querySelector(".work-list-container");

  // Xóa nội dung cũ nếu có
  datasetsContainer.innerHTML = "";

  datasets.forEach((dataset) => {
    const datasetElement = document.createElement("a");
    datasetElement.href = "./your-work-detail.html";
    datasetElement.classList.add("work-list-item");

    datasetElement.innerHTML = `
      <div class="col-3">
        <input type="checkbox" class="checkbox custom-checkbox" />${dataset.dataset_name}
      </div>
      <div class="col-3">${dataset.version_id}</div>
      <div class="col-3">${dataset.status}</div>
      <div class="col-3">Updated ${dataset.recently_updated}</div>
    `;

    datasetsContainer.appendChild(datasetElement);
  });
}

function loadUserReliability(user) {
  if (!user) {
    console.error("User reliability not found");
    return;
  }
  document.getElementById("user-reliability").textContent = user.reliability || "";
  if (user.reliability > 85) {
    document.getElementById("status").textContent = "Very good" || "";
  }
  else if (user.reliability > 70) {
    document.getElementById("status").textContent = "Good" || "";
  }
  else if (user.reliability > 60) {
    document.getElementById("status").textContent = "Average" || "";
  }
  else if (user.reliability > 50) {
    document.getElementById("status").textContent = "Bad" || "";
  }
  else {
    document.getElementById("status").textContent = "Very bad" || "";
  }
}
