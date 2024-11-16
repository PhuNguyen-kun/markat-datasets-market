<template>
  <div class="common__title-white--container datasets-page">
    <h1 class="common__title-white">Datasets</h1>
    <p class="common__desc-white">
      Explore, analyze, and share high-quality data. Learn more about the
      different types of data, how to create it, and collaborate effectively.
    </p>
  </div>

  <div
    class="dataset-page__container"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div
      class="card"
      v-for="(item, index) in items"
      :key="index"
      @click="goToDetail(item.id_dataset)"
    >
      <img :src="item.avatar" alt="Card image" class="card-image" />
      <div class="card-content">
        <h2 class="card-title">{{ item.name_dataset }}</h2>
        <p class="card-info">{{ item.views }} views</p>
        <p class="card-info">{{ item.version_count }} versions</p>
        <p class="card-info">{{ item.data_format }}</p>
        <div class="card-footer">
          <div class="views">
            <img
              src="../../../assets/icon/eye.svg"
              alt="Views"
              style="width: 15px; height: 20px; margin-right: 4px"
            />
            {{ item.views }}
          </div>
          <span class="status">Verified</span>
          <span class="discount">-{{ item.voucher }}%</span>
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

const route = useRouter()
const items = ref<any[]>([])
const isLoading = ref(true)
const fullscreenLoading = ref(false)

const openFullScreen1 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Markat is loading 🗿⌛',
    background: 'rgba(0, 0, 0, 0.2)',
  })
  setTimeout(() => {
    loading.close()
  }, 300)
}

const loadDatasets = async () => {
  try {
    openFullScreen1()
    items.value = await fetchDatasets()
  } catch (error) {
    console.error('Failed to load datasets:', error)
  }
}

const goToDetail = (id: number) => {
  route.push({ name: 'dataset-detail', params: { id } })
}

onMounted(() => {
  loadDatasets()
})
</script>

<style scoped lang="scss">
.dataset-page__container {
  margin-top: 20px;
  padding: 20px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: start;
}

.card {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 220px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.card-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  line-height: 15px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  //margin: 2px 0 1px 0;
  height: 60px;
  line-height: 22px;
}

.card-info {
  font-size: 0.9rem;
  color: #555;
  margin: 4px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 10px 0 0 0;
  margin-bottom: -5px;
}

.views {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
}

.icon-eye {
  margin-right: 5px;
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
