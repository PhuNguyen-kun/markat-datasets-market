<template>
  <div class="dataset-detail__container" v-if="dataset">
    <div class="dataset-detail__card">
      <div class="dataset-detail__heading">
        <div>
          <h1 class="common__title-black">{{ dataset.name_dataset }}</h1>
          <p class="dataset-detail__description">{{ dataset.description }}</p>
          <div class="dataset-detail__info">
            <p>{{ versionData.price }}</p>
            <p class="dataset-detail__size">
              Total size: {{ versionData.total_size / 1024}} GB
            </p>
            <p class="dataset-detail__records">
              Number of data: {{ versionData.number_of_data }} records
            </p>
            <p class="dataset-detail__updated">
              Day updated: {{ formatDate(versionData.day_updated) }}
            </p>
          </div>
          <div class="version-container" style="margin-bottom: 20px">
            <el-button
              v-for="(version, index) in versionsId"
              :key="version"
              class="version-button"
              @click="selectVersion(version)"
            >
              Version {{ index + 1 }}
            </el-button>
          </div>
          <div class="dataset-detail__buttons">
            <el-button
              class="dataset-detail__trybutton"
              @click="handleTryClick"
            >
              <div style="color: rgb(32, 33, 36)">Try first</div>
            </el-button>
            <el-button
              class="dataset-detail__buybutton"
              @click="handleBuyClick"
            >
              <div style="color: rgb(255, 255, 255)">Buy</div>
            </el-button>
          </div>
        </div>
        <img
          :src="`${dataset.avatar}`"
          alt="Dataset Image"
          class="dataset-detail__image"
        />
      </div>
    </div>
  </div>

  <div class="dataset-section">
    <div
      style="
        width: 100%;
        display: grid;
        grid-template-columns: auto 226px;
        gap: 24px;
        margin-bottom: 40px;
      "
    >
      <div>
        <div class="section-title">About Dataset</div>
        <div style="margin-top: 16px">
          This dataset contains information about three popular types of
          flowers: roses, shoeblack plants, and hibiscus. The data includes
          various attributes that are significant for understanding and
          predicting the characteristics of these flowers. Each entry in the
          dataset provides details on the species, size, fragrance, and height,
          which can be useful for botanical studies, horticultural planning, and
          machine learning model training. The dataset is synthetic, generated
          using the Faker library, and aims to simulate realistic data. While
          the data points do not correspond to real-world measurements, they are
          designed to follow typical characteristics observed in these flower
          species. This makes the dataset an excellent resource for educational
          purposes, prototyping machine learning models, and conducting
          preliminary data analysis.
        </div>
      </div>
      <div>
        <h2
          style="
            margin-top: 24px;
            color: rgb(32, 33, 36);
            font-size: 16px;
            line-height: 20px;
            font-weight: 700;
          "
        >
          Tags
        </h2>
        <div
          style="
            border: 0;
            font-family: inherit;
            font-size: 100%;
            font-style: inherit;
            font-variant: inherit;
            font-weight: inherit;
            margin: 0;
            padding: 0;
            vertical-align: baseline;
          "
        >
          <div class="dataset-tags" style="margin-top: 16px">
            <div class="tags-container">
              <div
                v-for="(tag, index) in tagsArray"
                :key="index"
                class="category-tag"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="overview-body">
    <div class="section-header">
      <h2 class="section-title">Activity Overview</h2>
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
        <div class="summary-text">Views in the last 30 days</div>
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
  <div
    v-for="(section, index) in datasetSections"
    :key="index"
    class="dataset-section"
  >
    <div class="section-header">
      <h2 class="section-title">{{ section.title }}</h2>
      <a href="#" class="see-all">See All</a>
    </div>
    <div class="card-grid">
      <div
        v-for="(dataset, index) in section.datasets"
        :key="index"
        @click="goToDetail(dataset.id_dataset)"
        class="card"
      >
        <img
          v-if="dataset && dataset.avatar"
          :src="dataset.avatar"
          alt="Dataset image"
          class="card-image"
        />
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
import { ref, onMounted, nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchDatasetsDetail,
  fetchVersionData,
  fetchDatasets,
} from '@/services/datasets'
import { Chart, registerables } from 'chart.js'
import { ElLoading } from 'element-plus'

Chart.register(...registerables)

const route = useRoute()
const router = useRouter()
const dataset = ref<any>(null)
const versionsId = ref<any>(null)
const versionData = ref<any>(null)
const viewsChart: Ref<HTMLCanvasElement | null> = ref(null)
const buysChart: Ref<HTMLCanvasElement | null> = ref(null)
const triesChart: Ref<HTMLCanvasElement | null> = ref(null)
const tagsArray = ref<any>(null)

const openFullScreen1 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Markat is loading 👟⌛',
    background: 'rgba(0, 0, 0, 0.2)',
  })
  setTimeout(() => {
    loading.close()
  }, 300)
}

const loadDatasetDetail = async () => {
  try {
    const datasetId = Number(route.params.id)
    const response = await fetchDatasetsDetail(datasetId)
    if (response && response.data) {
      dataset.value = response.data
      versionsId.value = response.data.versions
      await loadVersionData(versionsId.value[0])
    } else {
      console.error('No data returned from fetchDatasetsDetail')
    }
  } catch (error) {
    console.error('Failed to load dataset detail:', error)
  }
}

const selectVersion = async (versionId: number) => {
  try {
    await loadVersionData(versionId)
  } catch (error) {
    console.error('Failed to select version data :', error)
  }
}

const loadVersionData = async (versionId: number) => {
  try {
    versionData.value = null
    const response = await fetchVersionData(versionId)
    if (response && response.data) {
      versionData.value = response.data
    }
  } catch (error) {
    console.error('Failed to load version data:', error)
  }
}

const handleBuyClick = () => {}

const handleTryClick = () => {}

const getTagsArray = (): string[] => {
  if (dataset.value) {
    return dataset.value.tags
  }
  return []
}

const createChart = (
  ctx: CanvasRenderingContext2D,
  data: Number[],
  borderColor: string,
  backgroundColor: string,
) => {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: 'Activity',
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
          type: 'category',
          display: false,
        },
        y: {
          display: false,
          beginAtZero: true,
        },
      },
    },
  })
}

const loadDatasets = async () => {
  try {
    const topics = [{ title: 'Similar Datasets', topic: 'similarDatasets' }]

    for (const { title, topic } of topics) {
      try {
        const datasets = await fetchDatasets(4, topic)
        const section = datasetSections.value.find(
          section => section.title === title,
        )
        if (section) {
          section.datasets = datasets
        }
      } catch (error) {
        console.error(`Failed to load datasets for ${title}:`, error)
      }
    }
  } catch (error) {
    console.error('Failed to load datasets:', error)
  }
}

watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log(`Route param changed from ${oldId} to ${newId}`)
    openFullScreen1()
    loadDatasetDetail() // Gọi lại hàm để tải dữ liệu
  },
)

const goToDetail = (id: number) => {
  router.push({ name: 'dataset-detail', params: { id } })
}

onMounted(async () => {
  try {
    // console.log("onMounted is running");
    await loadDatasetDetail()
    tagsArray.value = await getTagsArray()
    nextTick(() => {
      if (viewsChart.value && buysChart.value && triesChart.value) {
        const viewsCtx = viewsChart.value.getContext('2d')
        const buysCtx = buysChart.value.getContext('2d')
        const triesCtx = triesChart.value.getContext('2d')

        // Kiểm tra và chỉ khởi tạo biểu đồ nếu context tồn tại
        if (viewsCtx) {
          createChart(
            viewsCtx,
            viewsData,
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 0.2)',
          )
        }

        if (buysCtx) {
          createChart(
            buysCtx,
            buysData,
            'rgba(75, 192, 192, 1)',
            'rgba(75, 192, 192, 0.2)',
          )
        }

        if (triesCtx) {
          createChart(
            triesCtx,
            triesData,
            'rgba(153, 102, 255, 1)',
            'rgba(153, 102, 255, 0.2)',
          )
        }
      }
    })

    await loadDatasets()
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewsData = Array.from(
  { length: 30 },
  () => Math.floor(Math.random() * 500) + 100,
)
const buysData = Array.from(
  { length: 30 },
  () => Math.floor(Math.random() * 300) + 50,
)
const triesData = Array.from(
  { length: 30 },
  () => Math.floor(Math.random() * 400) + 80,
)

type Dataset = {
  id_dataset: number
  name_dataset?: string
  avatar?: string
  verified?: boolean
  views?: number
  voucher?: string[]
  data_format?: string
  version_count?: number
  latest_valuation_due_date?: string
  day_updated?: string
}

type DatasetSection = {
  title: string
  datasets: Dataset[]
}

const datasetSections = ref<DatasetSection[]>([
  {
    title: 'Similar Datasets',
    datasets: [],
  },
])
</script>

<style lang="scss">
.dataset-detail {
  &__container {
    max-width: 1200px;
    margin: 20px auto auto auto;
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
    margin-top: 30px;
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
    margin-top: 100px;
    width: 300px;
    height: 210px;
    object-fit: cover;
    border-radius: 10px;
  }
}

.category-tag {
  padding: 6px 12px;
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

.category-tag:hover {
  background-color: #f5f5f5;
  border: 1px solid black;
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
  margin-top: 0px;
  display: flex;
  flex-flow: wrap;
  align-items: center;
  gap: 8px;
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
  transition:
    transform 0.3s,
    box-shadow 0.3s;
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

.card {
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
  border-top: solid;
  padding: 12px 24px;
  border-top: var(--bs-card-border-width, 1px) solid
    var(--bs-card-border-color, #ddd);
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
