<template>
  <div class="dataset-detail__container" v-if="dataset">
    <div class="dataset-detail__card">
      <div class="dataset-detail__heading">
        <div>
          <h1 class="common__title-black">{{ dataset.name_dataset }}</h1>
          <p class="dataset-detail__description">{{ dataset.description }}</p>
          <div class="dataset-detail__info">
            <p class="dataset-detail__size">Total size: {{ versionData.total_size }} GB</p>
            <p class="dataset-detail__records">Number of data: {{ versionData.number_of_data }} records</p>
            <p class="dataset-detail__updated">Day updated: {{ formatDate(versionData.day_updated) }}</p>
          </div>
          <div class="dataset-detail__buttons">
            <el-button class="dataset-detail__trybutton" @click="handleTryClick">
              <div style = "color: rgb(32, 33, 36);">
                Try first
              </div>
            </el-button>
            <el-button class="dataset-detail__buybutton" @click="handleBuyClick">
              <div style = "color: rgb(255, 255, 255);">
                Buy
              </div>
            </el-button>
          </div>
          <div class="version-container" style = "margin-top : 20px;">
            <el-button v-for="version in versionCount" :key="version.id" class="version-button" @click="selectVersion(version.id)">
              Version {{ version }}
            </el-button>
          </div>
        </div>
        <img :src="`${dataset.avatar}`" alt="Dataset Image" class="dataset-detail__image" />
      </div>
    </div>

    <div class="dataset-section">
      <div class="dataset-tags">
        <div class="tags-container">
          <el-tag v-for="(tag, index) in expertTagsArray" :key="index" class="expert-tag">
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="dataset-section">
      <div class="section-header">
        <div class = "section-title">
          About Dataset
        </div>
      </div>
      <div >
        This dataset contains information about three popular types of flowers: roses, shoeblack plants, and hibiscus. The data includes various attributes that are significant for understanding and predicting the characteristics of these flowers. Each entry in the dataset provides details on the species, size, fragrance, and height, which can be useful for botanical studies, horticultural planning, and machine learning model training.
        The dataset is synthetic, generated using the Faker library, and aims to simulate realistic data. While the data points do not correspond to real-world measurements, they are designed to follow typical characteristics observed in these flower species. This makes the dataset an excellent resource for educational purposes, prototyping machine learning models, and conducting preliminary data analysis.
      </div>
    </div>

  </div>
  <div class="overview-body">
    <div class = "section-header">
      <h2 class = "section-title">
        Activity Overview
      </h2>
    </div>
    <div class="overview-container">
      <div class="summary-container">
        <div class="summary-details">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/visible.png"
            alt="views"
          />
          7,085
        </div>
        <div class="summary-text">
          Views in the last 30 days
        </div>
        <canvas ref="viewsChart" class="trend-chart"></canvas>
      </div>
      <div class="summary-container">
        <div class="summary-details">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/shopping-cart.png"
            alt="buys"
          />
          1,061
        </div>
        <div class="summary-text">Buys in the last 30 days</div>
        <canvas ref="buysChart" class="trend-chart"></canvas>
      </div>
      <div class="summary-container">
        <div class="summary-details">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/try-and-buy.png"
            alt="try-and-buy"
          />
          1,061
        </div>
        <div class="summary-text">Try in the last 30 days</div>
        <canvas ref="triesChart" class="trend-chart"></canvas>
      </div>
    </div>
  </div>
  <div v-for="(section, index) in datasetSections" :key="index" class="dataset-section">
    <div class="section-header">
      <h2 class="section-title"> {{ section.title }} </h2>
      <a href="#" class="see-all">See All</a>
    </div>
    <div class="card-grid">
      <div
        v-for="(dataset, index) in section.datasets"
        :key="index"
        @click="goToDetail(dataset.id_dataset)"
        class="cards"
      >
        <img v-if="dataset && dataset.avatar" :src="dataset.avatar" alt="Dataset image" class="card-image" />
        <div class="card-content compact">
          <h2 class="card-title">{{ dataset.name_dataset }}</h2>
          <div class="card-info">
            <p class="card-info">Updated {{ dataset.day_updated }}</p>
            <p class="card-info">Versions: {{ dataset.version_count }}</p>
            <p class="card-info">Format: {{ dataset.data_format }}</p>
          </div>
        </div>
        <div class="card-footer">
          <div class="views">
            <img
              src="../../../assets/icon/eye.svg"
              alt="Views"
              class="icon-eye"
            />
            {{ dataset.views }}
          </div>
          <span v-if="dataset.verified" class="tag status">Verified</span>
          <span class="discount">{{ dataset.voucher }}% </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { fetchDatasetsDetail, fetchVersionData, fetchDatasets } from '@/services/datasets';
import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

const route = useRoute();
const dataset = ref<any>(null);
const versionData = ref<any>(null);
const viewsChart = ref(null);
const buysChart = ref(null);
const triesChart = ref(null);
const versionCount = [1,2,3,4];

const loadDatasetDetail = async () => {
  try {
    const datasetId = Number(route.params.id);
    const response = await fetchDatasetsDetail(datasetId);
    if (response && response.data) {
      dataset.value = response.data;
      await loadVersionData(datasetId, 1);
    }
  } catch (error) {
    console.error('Failed to load dataset detail:', error);
  }
};

const loadVersionData = async (datasetId: number, versionId: number) => {
  try {
    versionData.value = null;
    const response = await fetchVersionData(datasetId, versionId);
    if (response && response.data) {
      versionData.value = response.data;
    }
    //versionData.value = (1,2,3,4);
  } catch (error) {
    console.error('Failed to load version data:', error);
  }
};

const createChart = (ctx, data, borderColor, backgroundColor) => {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: "Activity",
          data: data,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem) {
              return `Value: ${tooltipItem.raw}`
            },
          },
        },
      },
      scales: {
        x: {
          type: 'category', // Xác định loại thang đo
          display: false,
        },
        y: {
          display: false,
          beginAtZero: true,
        },
      },
    },
  });
};

const loadDatasets = async (limit : number, offset : number, topic : string) => {
  try {
      const topics = [
      { title: 'Similar Datasets', topic: 'similarDatasets' },
    ];

    for (const { title, topic } of topics) {
      try {
        const datasets = await fetchDatasets(4, 0, topic);
        const section = datasetSections.value.find((section) => section.title === title);
        if (section) {
          section.datasets = datasets;
        }
      } catch (error) {
        console.error(`Failed to load datasets for ${title}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to load datasets:', error)
  }
}

const goToDetail = (id: number) => {
  route.push({ name: 'dataset-detail', params: { id } })
}

onMounted(async () => {
  await loadDatasetDetail();
  nextTick(() => {
    if (viewsChart.value && buysChart.value && triesChart.value) {
      createChart(
        viewsChart.value.getContext("2d"),
        viewsData,
        "rgba(54, 162, 235, 1)",
        "rgba(54, 162, 235, 0.2)",
      );
      createChart(
        buysChart.value.getContext("2d"),
        buysData,
        "rgba(75, 192, 192, 1)",
        "rgba(75, 192, 192, 0.2)",
      );
      createChart(
        triesChart.value.getContext("2d"),
        triesData,
        "rgba(153, 102, 255, 1)",
        "rgba(153, 102, 255, 0.2)",
      );
    }
  });
  await loadDatasets();
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const expertTagsArray = computed(() => {
  return dataset.value.tags ? dataset.value.tags.split(',').map(tag => tag.trim()) : [];
});

const viewsData = Array.from(
  { length: 30 },
  () => Math.floor(Math.random() * 500) + 100,
);
const buysData = Array.from(
  { length: 30 },
  () => Math.floor(Math.random() * 300) + 50,
);
const triesData = Array.from(
  { length: 30 },
  () => Math.floor(Math.random() * 400) + 80,
);

 const datasetSections = ref([
    {
      title: 'Similar Datasets',
      datasets: []
    },
  ]);
</script>

<style scoped lang="scss">
.dataset-detail {
  &__container {
    max-width: 1200px;
    margin: auto;
  }

  &__card {
    max-width: 1200px;
    margin: auto;
  }

  &__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    gap: 20px;
    margin-bottom: 30px;
  }

  &__heading img {
    border: 0;
    font-family: inherit;
    font-size: 100%;
    font-style: inherit;
    font-variant: inherit;
    font-weight: inherit;
    margin-top : 30px;
    padding: 0;
    vertical-align: baseline;
  }

  &__heading h1 {
    font-size: 2.2rem;
    font-weight: 700;
    color: #333;
  }

  &__description {
    margin-top: 10px;
    font-size: 1rem;
    color: #555;
  }

  &__info {
    margin: 15px 0;
  }

  &__buttons {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
  &__buybutton {
  align-items: center;
  background-color: rgb(32, 33, 36);
  border-radius: 20px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  padding: 0px 16px 0px 12px;
  transition: 0.3s;
  white-space: nowrap;
  width: 100px;
  }

  &__trybutton {
  align-items: center;
  background-color: transparent;
  border-radius: 20px;
  border: 1px solid rgb(189, 193, 198);
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  padding: 0px 24px;
  transition: 0.3s;
  white-space: nowrap;
  width: fit-content;
}
  &__image {
    margin-top : 100px;
    width: 300px;
    height: 210px;
    object-fit: cover;
    border-radius: 10px;
  }
}

.dataset-description,
.dataset-about,
.dataset-request,
.dataset-activity,

.expert-tag {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.dataset-request__content {
  margin: 10px 0;
}

.tags-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.activity-metrics {
  display: flex;
  gap: 30px;
}

.similar-dataset {
  margin-top: 20px;
}

.similar-dataset__image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
}

.overview-body {
  font-family: 'Roboto', sans-serif;
  width: 1200px;
  margin: 0 auto 30px auto;
}

.overview-container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.summary-container {
  width: 28%;
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.summary-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.summary-details {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.summary-header {
  font-size: 2.5em;
  font-weight: 700;
  color: #333;
  margin-right: 10px;
}

.summary-text {
  font-size: 1em;
  color: #777;
  text-align: center;
}

.trend-chart {
  width: 100%;
  height: 80px;
  max-height: 80px;
}

.summary-details img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

// Category Dataset Styles
.dataset-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 30px auto;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 45px auto 20px auto;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  gap: 10px;
}

.see-all {
  padding: 8px 16px;
  border-radius: 20px;
  color: #333;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: bold;
  transition:
  background-color 0.3s,
  color 0.3s;
}

.see-all:hover {
  background-color: #e0e0e0;
  color: #000;
}

.card-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.cards {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  height: 330px;
  width: 280px;
}

.card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-content.compact {
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.card-title {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 10px;
}

.card-info {
  font-size: 0.8rem;
  color: #555;
  margin-top: 5px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.views {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.icon-eye {
  margin-right: 5px;
  width: 18px;
  height: 18px;
}

.status {
  color: #4caf50;
  font-weight: bold;
  background-color: #e8f5e9;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.discount {
  color: #e53935;
  font-weight: bold;
}
</style>
