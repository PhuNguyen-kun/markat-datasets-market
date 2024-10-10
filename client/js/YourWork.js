document.addEventListener("DOMContentLoaded", function () {
  // Gọi API để lấy danh sách datasets
  axios
    .get("http://localhost:8888/yourwork")
    .then((response) => {
      const datasets = response.data.items; // Truy cập vào mảng datasets trong key 'items'
      renderOwnedDatasets(datasets);
    })
    .catch((error) => console.error("Error fetching datasets:", error));
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
