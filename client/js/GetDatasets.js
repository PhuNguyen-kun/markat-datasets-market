document.addEventListener("DOMContentLoaded", function () {
  const customerData = JSON.parse(sessionStorage.getItem("customer"));
  //console.log(customerData.id_user);

  // Gọi API để lấy danh sách datasets với id_user
  axios
    .get("http://localhost:8888/datasets")
    .then((response) => {
      const datasets = response.data.items; // Truy cập vào mảng datasets trong key 'items'
      renderDatasets(datasets);
    })
    .catch((error) => console.error("Error fetching datasets:", error));
});

function renderDatasets(datasets) {
  const datasetsContainer = document.querySelector(".col-10 > .row"); // Chọn container mà trong đó dữ liệu sẽ được render
  datasetsContainer.innerHTML = ""; // Xóa nội dung cũ (nếu có)

  datasets.forEach((dataset) => {
    // Tạo một thẻ div cho mỗi dataset
    const datasetElement = document.createElement("div");
    datasetElement.classList.add("col-3");

    // Tạo nội dung HTML bên trong dataset
    datasetElement.innerHTML = `
      <div class="datasets__item" style="cursor: pointer;">
        <img src="./assets/img/${dataset.avatar}" alt="${dataset.name_dataset}" class="datasets__item--bgr" />
        <div class="datasets__item--details">
          <h3 class="datasets__item--title">${dataset.name_dataset}</h3>
          <p class="datasets__item--desc1">
            <span>${dataset.views} views</span>
            <span>${dataset.version_count} versions</span>
            <span>${dataset.data_format}</span>
          </p>
          <div class="datasets__item--desc2">
            <div style="display: flex; align-items: center; justify-content: center;">
              <img src="./assets/icons/eye.svg" alt="Views" style="width: 15px; height: 20px; margin-right: 4px" />
              <span style="font-size: 13px; font-weight: 400; margin-right: 12px;">${dataset.views}</span>
              <button class="btn btn--green" style="width: 65px; height: 19px; font-size: 12px">Verified</button>
            </div>
            <span style="color: red; font-size: 16px; font-weight: 600">-${dataset.voucher}%</span>
          </div>
        </div>
      </div>
    `;

    // Thêm sự kiện click vào mỗi phần tử để chuyển hướng khi nhấn vào dataset
    datasetElement.addEventListener("click", () => {
      window.location.href = `./${dataset.slug}`;
    });

    // Thêm phần tử vào trong container
    datasetsContainer.appendChild(datasetElement);
  });
}
