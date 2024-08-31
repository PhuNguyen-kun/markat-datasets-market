// document.addEventListener('DOMContentLoaded', function () {
//     // Gọi API để lấy danh sách sản phẩm
//     axios.get('http://localhost:8888/datasets')  // Thay URL bằng URL API thực tế của bạn
//         .then(response => {
//             const datasets = response.data;
//             // Render danh sách sản phẩm lên trang
//             //renderDatasets(datasets);
//             console.log(datasets);
//         })
//         .catch(error => console.error('Error fetching datasets:', error));
// });
// function renderDatasets(datasets) {
//     const mainContainer = document.querySelector('.home__container');
//     mainContainer.innerHTML = ''; // Clear existing content

//     let rowContainer = createNewRowContainer();

//     datasets.forEach((dataset, index) => {
//         if (index % 4 === 0 && index !== 0) {
//             mainContainer.appendChild(rowContainer);
//             rowContainer = createNewRowContainer();
//         }

//         const datasetElement = `
//             <div class="col">
//                 <article class="cate-item">
//                     <img src="data:image/jpeg;base64,${dataset.Avatar}" alt="${dataset.Name_dataset}" class="cate-item__thumb" onclick="location.href='view/sign-in.html';" />
//                     <section class="cate-item__info">
//                         <a href="http://127.0.0.1:5501/markat/view/sign-in.html" class="cate-item__title">${dataset.Name_dataset}</a>
//                     </section>
//                 </article>
//             </div>
//         `;

//         rowContainer.innerHTML += datasetElement;
//     });

//     // Append the last row container
//     mainContainer.appendChild(rowContainer);
// }

// function createNewRowContainer() {
//     const rowContainer = document.createElement('div');
//     rowContainer.className = 'row row-cols-4 row-cols-md-1';
//     return rowContainer;
// }

document.addEventListener("DOMContentLoaded", function () {
  // Gọi API để lấy danh sách datasets
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
    const datasetElement = `
            <div class="col-3">
                <div class="datasets__item">
                    <img src="../assets/img/${dataset.avatar}" alt="${dataset.name_dataset}" class="datasets__item--bgr" />
                    <div class="datasets__item--details">
                        <h3 class="datasets__item--title">${dataset.name_dataset}</h3>
                        <p class="datasets__item--desc1">
                            <span>${dataset.views} views</span>
                            <span>${dataset.version_count} versions</span>
                            <span>${dataset.data_format}</span>
                        </p>
                        <div class="datasets__item--desc2">
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <img src="../assets/icons/eye.svg" alt="Views" style="width: 15px; height: 20px; margin-right: 4px" />
                                <span style="font-size: 13px; font-weight: 400; margin-right: 12px;">${dataset.views}</span>
                                <button class="btn btn--green" style="width: 65px; height: 19px; font-size: 12px">Verified</button>
                            </div>
                            <span style="color: red; font-size: 16px; font-weight: 600">-${dataset.voucher}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

    datasetsContainer.innerHTML += datasetElement;
  });
}
