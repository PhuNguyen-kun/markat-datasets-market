<template>
  <div class="common__title-white--container datasets-page">
    <h1 class="common__title-white">Datasets</h1>
    <p class="common__desc-white">
      Explore, analyze, and share high-quality data. Learn more about the
      different types of data, how to create it, and collaborate effectively.
    </p>
  </div>

  <!-- Sale Section -->
  <div class="sale-section">
    <div class="sale-title">
      <h2>Special Discounted Datasets</h2>
    </div>
    <div class="sale-carousel-wrapper">
      <div class="sale-carousel-container">
        <div
          v-for="(dataset, index) in saleDatasets"
          :key="index"
          class="card sale-card"
        >
          <img :src="dataset.image" alt="Dataset image" class="card-image" />
          <div class="card-content compact centered">
            <h2 class="card-title">{{ dataset.name }}</h2>
            <div class="card-info">
              <p class="card-info">
                Discounted Price: {{ dataset.discountPrice }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="search-bar-container">
    <div class="search-bar">
      <span class="icon" style="color: #757575">🔍</span>
      <input type="text" v-model="searchQuery" placeholder="Search datasets" />
    </div>
    <button class="filter-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M10 18h4v-2h-4v2zm-7-6v2h18v-2H3zm3-4h12V6H6v2z"></path>
      </svg>
      Filters
    </button>
  </div>

  <!-- Category Tags -->
  <div class="category-tags" style="max-width: 1200px; margin: 0 auto">
    <div v-for="(tag, index) in categoryTags" :key="index" class="category-tag">
      {{ tag }}
    </div>
  </div>

  <!-- Datasets Sections -->
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
import { ref, onMounted } from 'vue'
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import { fetchProjects } from '@/services/projects';
import { fetchDatasets } from '@/services/datasets';

const route = useRouter()
const datasets = ref<any[]>([])
const isLoading = ref(true)
const fullscreenLoading = ref(false)
const searchQuery = ref('')

const saleCarouselContainer = document.querySelector(
  '.sale-carousel-container',
) as HTMLElement | null;

const categoryTags = ref([
  'All datasets',
  'Computer Science',
  'Education',
  'Classification',
  'Computer Vision',
  'NLP',
  'Data Visualization',
  'Pre-Trained Model',
])

type Dataset = {
  id_dataset: number;
  name_dataset?: string;
  avatar?: string;
  verified?: boolean;
  views?: number;
  voucher?: string[];
  data_format?: string;
  version_count?: number;
  latest_valuation_due_date?: string;
  day_updated?: string;
};

type DatasetSection = {
  title: string;
  datasets: Dataset[];
};

const datasetSections = ref<DatasetSection[]>([
  {
    title: 'Trending Datasets',
    datasets: [] ,
  },
  {
    title: 'Healthcare Datasets',
    datasets: [],
  },
  {
    title: 'Animal Datasets',
    datasets: [],
  },
  {
    title: 'Earth and Nature Datasets',
    datasets: [],
  },
  {
    title: 'Recently Viewed Datasets',
    datasets: [],
  },
]);

const saleDatasets = ref([
  {
    image:
      'https://storage.googleapis.com/kaggle-datasets-images/5922591/9688104/226010b17b3ada6068ffb6a684565b10/dataset-cover.png?t=2024-10-22-02-50-51',
    name: 'Binance Coin',
    discountPrice: '$10.00',
  },
  {
    image:
      'https://storage.googleapis.com/kaggle-datasets-images/5813326/9542635/c1be59c679780569020f5665a131ddbe/dataset-cover.jpg?t=2024-10-03-22-39-41',
    name: 'COVID 19 Dataset',
    discountPrice: '$15.00',
  },
  {
    image:
      'https://storage.googleapis.com/kaggle-datasets-images/5875096/9624910/20079a4cb6283ca6dd1f27a86c03c1af/dataset-cover.png?t=2024-10-14-20-25-19',
    name: 'Esophageal Cancer Dataset',
    discountPrice: '$20.00',
  },
  {
    image:
      'https://storage.googleapis.com/kaggle-datasets-images/5936111/9705963/082deb5ddef7115535fcbe53b923d3e0/dataset-cover.jpg?t=2024-10-24-11-42-23',
    name: 'Gold Price Regression',
    discountPrice: '$25.00',
  },
  {
    image:
      'https://storage.googleapis.com/kaggle-datasets-images/5991508/9780089/bbda05846ccf00c77af547701626330e/dataset-cover.jpg?t=2024-11-01-11-55-37',
    name: "World's Richest Sports Leagues Dataset",
    discountPrice: '$30.00',
  },
  {
    image:
      'https://storage.googleapis.com/kaggle-datasets-images/5939172/9709961/41861e256033e26bf5bfb52d80c00edc/dataset-cover.PNG?t=2024-10-24-16-57-02',
    name: 'GDP-BY-COUNTRY-2023',
    discountPrice: '$30.00',
  },
])

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

const setupSaleCarousel = () => {
  if (saleCarouselContainer) {
    const saleCards = saleCarouselContainer.querySelectorAll('.sale-card')
    saleCards.forEach(card => {
      const clone = card.cloneNode(true)
      saleCarouselContainer.appendChild(clone)
    })
    saleCarouselContainer.style.overflow = 'visible'
  }
}

const startSaleCarousel = () => {
  let currentPosition = 0
  const spacing = 23

  function startCarousel() {
    if (saleCarouselContainer) {
      const saleCards = saleCarouselContainer.querySelectorAll('.sale-card')
      if (saleCards.length > 0) {
        const cardWidth = (saleCards[0] as HTMLElement).offsetWidth
        currentPosition -= 1
        saleCarouselContainer.style.transition = 'transform 0.05s linear'
        saleCarouselContainer.style.transform = `translateX(${currentPosition}px)`
        if (Math.abs(currentPosition) >= cardWidth) {
          saleCarouselContainer.style.transition = 'none'
          currentPosition += cardWidth + spacing
          saleCarouselContainer.style.transform = `translateX(${currentPosition}px)`
          saleCarouselContainer.appendChild(saleCards[0])
        }
      }
    }
  }
  setInterval(startCarousel, 16)
}

const loadDatasets = async () => {
  try {
    const topics = [
      { title: 'Trending Datasets', topic: 'trendingDatasets' },
      { title: 'Healthcare Datasets', topic: 'healthCare' },
      { title: 'Animal Datasets', topic: 'animal' },
      { title: 'Earth and Nature Datasets', topic: 'earthAndNature' },
      { title: 'Recently Viewed Datasets', topic: 'recentlyViewedDatasets' },
    ]

    for (const { title, topic } of topics) {
      try {
        const datasets = await fetchDatasets(4, 0, topic)
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

const goToDetail = (id: number) => {
  route.push({ name: 'dataset-detail', params: { id } })
}

onMounted(async () => {
  await openFullScreen1()
  await loadDatasets()
  await setupSaleCarousel()
  await startSaleCarousel()
})

</script>

<style lang="scss">
/* Search Bar Styles */
.search-bar-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 30px auto;
  padding: 8px 16px;
  border-radius: 30px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  flex: 1;
}

.search-bar input[type='text'] {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  color: #333;
}

.search-bar .icon {
  margin-right: 10px;
  color: #757575;
  font-size: 20px;
}

.filter-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: none;
  border-radius: 30px;
  background-color: #f5f5f5;
  color: #333;
  cursor: pointer;
  font-size: 16px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.filter-button:hover {
  background-color: #e0e0e0;
  color: #000;
}

.filter-button svg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

/* Category Tags Styles */
.category-tags {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 30px auto;
  gap: 10px;
  flex-wrap: wrap;
}

.category-tag {
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

.category-tag:hover {
  background-color: #f5f5f5;
  border: 1px solid black;
}

// Sale Dataset Carousel Styles
.sale-carousel-container {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  position: relative;
  display: flex;
  transition: transform 1s ease-in-out;
  will-change: transform;
  align-items: center;
  overflow: hidden;
  background-color: #fff;
  gap: 20px;
}

.sale-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  font-weight: bold;
  margin-top: 30px;
}

.sale-carousel-wrapper {
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 0px auto 20px;
  position: relative;
}

.sale-carousel {
  display: flex;
  max-width: 1200px;
  margin: 0 auto 20px auto;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  transition: transform 1s ease-in-out;
}

.sale-card {
  display: flex;
  min-width: calc((100% / 4) - 15px);
  flex-shrink: 0;
  box-sizing: border-box;
  flex: 1;
  gap: 20px;
  transition: transform 0.5s ease;
}

// Center content in sale cards
.card-content.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
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
