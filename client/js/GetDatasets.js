document.addEventListener('DOMContentLoaded', function () {
    // Gọi API để lấy danh sách sản phẩm
    axios.get('http://localhost:8888/datasets')  // Thay URL bằng URL API thực tế của bạn
        .then(response => {
            const datasets = response.data;
            // Render danh sách sản phẩm lên trang
            //renderDatasets(datasets);
            console.log(datasets);
        })
        .catch(error => console.error('Error fetching datasets:', error));
});
function renderDatasets(datasets) {
    const mainContainer = document.querySelector('.home__container');
    mainContainer.innerHTML = ''; // Clear existing content

    let rowContainer = createNewRowContainer();

    datasets.forEach((dataset, index) => {
        if (index % 4 === 0 && index !== 0) {
            mainContainer.appendChild(rowContainer);
            rowContainer = createNewRowContainer();
        }

        const datasetElement = `
            <div class="col">
                <article class="cate-item">
                    <img src="data:image/jpeg;base64,${dataset.Avatar}" alt="${dataset.Name_dataset}" class="cate-item__thumb" onclick="location.href='view/sign-in.html';" />
                    <section class="cate-item__info">
                        <a href="http://127.0.0.1:5501/markat/view/sign-in.html" class="cate-item__title">${dataset.Name_dataset}</a>
                    </section>
                </article>
            </div>
        `;

        rowContainer.innerHTML += datasetElement;
    });

    // Append the last row container
    mainContainer.appendChild(rowContainer);
}

function createNewRowContainer() {
    const rowContainer = document.createElement('div');
    rowContainer.className = 'row row-cols-4 row-cols-md-1';
    return rowContainer;
}
