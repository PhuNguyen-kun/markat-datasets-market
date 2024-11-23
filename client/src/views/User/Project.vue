<template>
  <div class="common__title-white--container datasets-page">
    <h1 class="common__title-white">Project</h1>
    <p class="common__desc-white">
      Explore, analyze, and share high-quality data. Learn more about the
      different types of data, how to create it, and collaborate effectively.
    </p>
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
  <div class="progress-container">
    <div :id="'progress-bar-1'" class="progress-bar"></div>
  </div>

  <!-- Datasets Sections -->
  <div
    v-for="(section, index) in projectSections"
    :key="index"
    class="dataset-section"
  >
    <div class="section-header">
      <h2 class="section-title">{{ section.title }}</h2>
      <a href="#" class="see-all">See All</a>
    </div>
    <div class="card-grid">
      <div
        v-for="(project, index) in section.projects"
        :key="index"
        @click="goToDetail(project.id_dataset)"
        class="card"
      >
        <img
          v-if="project && project.avatar"
          :src="project.avatar"
          alt="Dataset image"
          class="card-image"
        />
        <div class="card-content compact">
          <h2 class="card-title">{{ project.name_dataset }}</h2>
          <div class="card-info">
            <p class="card-info"> {{ project.status }}</p>
            <p class="card-info"> {{ project.time }}</p>
            <div class="progress-container">
              <div :id="'progress-bar-' + project.id_version" class="progress-bar"></div>
            </div>
            <!-- <p class="card-info">Format: {{ dataset.data_format }}</p> -->
          </div>
        </div>
        <div class="card-footer">
          <div class="views">
            <img
              src="./../../assets/icon/users.jpg"
              alt="Views"
              class="icon-eye"
            />
            {{ project.usersCount }}
          </div>
          <div>
            <img
              src="./../../assets/icon/stock-share.png"
              alt="Views"
              class="icon-eye"
            />
            {{ project.stock_percent }}%
          </div>
          <div>
            <img
              src="./../../assets/icon/reliability.png"
              alt="Views"
              class="icon-eye"
            />
            {{ project.reliability_minimum }}
          </div>
          <!-- <span v-if="dataset.verified" class="tag status">Verified</span>
          <span class="discount">{{ dataset.voucher }}% </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDatasets } from '@/services/datasets'
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import { fetchProjects } from '@/services/projects';

const route = useRouter()
const datasets = ref<any[]>([])
const isLoading = ref(true)
const fullscreenLoading = ref(false)
const searchQuery = ref('')

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

type Project = {
  id_dataset: number,
  avatar? : string,
  id_version : number,
  name_dataset?: string,
  stock_percent?: 80,
  reliability_minimum?: 92,
  time?: string,
  status?: string,
  usersCount?: number
};

type ProjectSection = {
  title: string;
  projects: Project[];
};

const projectSections = ref<ProjectSection[]>([
  {
    title: 'Trending Datasets',
    projects: [] ,
  },
  {
    title: 'Healthcare Datasets',
    projects: [],
  },
  {
    title: 'Animal Datasets',
    projects: [],
  },
  {
    title: 'Earth and Nature Datasets',
    projects: [],
  },
  {
    title: 'Recently Viewed Datasets',
    projects: [],
  },
]);

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
        const projects = await fetchProjects(4, 0, topic)
        console.log(projects);

        const section = projectSections.value.find(
          section => section.title === title,
        )
        if (section) {
          section.projects = projects
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

const updateProgressBar = (id: number, progress: number) => {
  const progressBar = document.getElementById(`progress-bar-${id}`);

  if (!progressBar) {
    console.error(`Progress bar with ID progress-bar-${id} not found`);
    return;
  }
  console.log(id, progress)
  // Giới hạn progress từ 0 đến 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Cập nhật chiều rộng
  progressBar.style.width = `${clampedProgress}%`;

  // Tính toán màu sắc
  const red = Math.floor((clampedProgress / 100) * 255);
  const green = 255 - red;
  progressBar.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
};

// Ví dụ sử dụng với backend truyền data
// Dữ liệu được cập nhật từ backend (giả lập qua setInterval)

onMounted(async () => {
  // Gọi hàm mở toàn màn hình
  await openFullScreen1();

  // Tải dữ liệu
  await loadDatasets();
  updateProgressBar(1, 50);
  // Lặp qua từng section và cập nhật thanh tiến trình cho từng project
  projectSections.value.forEach((section) => {
    section.projects.forEach((project) => {
      updateProgressBar(project.id_version, Number(Math.floor(Math.random() * 101)));
    });
  });
});

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

.progress-container {
  width: 100%;
  margin-top: 15px;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

#progress-bar {
  width: 0%;
  height: 100%;
  border-radius: 15px;
  transition: width 0.3s, background-color 0.3s;
  background-color: #00ff00; /* Xanh lá */
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
