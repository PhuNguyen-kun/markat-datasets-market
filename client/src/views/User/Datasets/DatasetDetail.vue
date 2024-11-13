<template>
  <div class="dataset-detail__container" v-if="dataset">
    <router-link to="/datasets" class="page-link">
      <button class="btn btn--rounded" style="margin-bottom: 30px">
        <el-icon size="20">
          <Back />
        </el-icon>
        <span>Back</span>
      </button>
    </router-link>
    <div class="dataset-detail__heading">
      <div>
        <h1 class="common__title-black">{{ dataset.name_dataset }}</h1>
        <p class="common__desc-black">{{ dataset.description }}</p>
      </div>
      <img
        :src="`${dataset.avatar}`"
        alt="Dataset Image"
        class="dataset-detail__image"
      />
    </div>
    <el-tabs
      type="border-card"
      class="dataset-detail__version-container"
      v-model="activeTab"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="version in versionTabs"
        :key="version"
        :label="`Version ${version}`"
        :name="`version-${version}`"
        class="version-content"
      >
        <div class="version-content__left">
          <transition name="fade">
            <div v-if="versionData">
              <p class="version-desc">
                <strong style="font-weight: 600; display: block; width: 180px"
                  >Price:</strong
                >
                <span style="display: flex; gap: 10px">
                  <span>{{ versionData.price }}</span>
                  <img
                    src="/Screenshot%202024-11-09%20023923.png"
                    alt=""
                    style="
                      width: 30px;
                      border-radius: 999px;
                      border: 1px solid #888;
                      object-fit: cover;
                      transform: scale(1);
                      transform-origin: center;
                    "
                  />
                </span>
              </p>
              <p class="version-desc">
                <strong style="font-weight: 600; display: block; width: 180px"
                  >Total Size:</strong
                >
                {{ versionData.total_size }} MB
              </p>
              <p class="version-desc">
                <strong style="font-weight: 600; display: block; width: 180px"
                  >Number of Data:</strong
                >
                {{ versionData.number_of_data }}
              </p>
              <p class="version-desc">
                <strong style="font-weight: 600; display: block; width: 180px"
                  >Last Updated:</strong
                >
                {{ formatDate(versionData.day_updated) }}
              </p>
            </div>
            <div v-else>
              <!--            <p>Loading data...</p>-->
            </div>
          </transition>
          <div class="version-content__left--directory">
            About this directory
            <div
              style="width: 270px; display: flex; gap: 20px; margin-top: 20px"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M0 96C0 60.7 28.7 32 64 32l132.1 0c19.1 0 37.4 7.6 50.9 21.1L289.9 96 448 96c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-256c0-8.8-7.2-16-16-16l-161.4 0c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7L64 80z"
                />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M0 96C0 60.7 28.7 32 64 32l132.1 0c19.1 0 37.4 7.6 50.9 21.1L289.9 96 448 96c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-256c0-8.8-7.2-16-16-16l-161.4 0c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7L64 80z"
                />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M0 96C0 60.7 28.7 32 64 32l132.1 0c19.1 0 37.4 7.6 50.9 21.1L289.9 96 448 96c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-256c0-8.8-7.2-16-16-16l-161.4 0c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7L64 80z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="version-content__right">
          <div style="font-weight: 600; font-size: 17px">Expert tag</div>
          <div style="display: flex; gap: 10px">
            <el-tag
              v-for="(tag, index) in expertTagsArray"
              :key="index"
              effect="light"
              type="primary"
              class="expert-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="version-content__right--actions">
            <button class="btn btn--rounded">Try first</button>
            <button class="btn btn--primary-round">Buy this version</button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDatasetsDetail, fetchVersionData } from '@/services/datasets'
import { ElLoading } from 'element-plus'

const route = useRoute()
const dataset = ref<any>(null)
const activeTab = ref('version-1')
const versionTabs = ref<number[]>([])
const versionData = ref<any>(null)

const loadDatasetDetail = async () => {
  const datasetId = Number(route.params.id)
  dataset.value = await fetchDatasetsDetail(datasetId)
  console.log('Dataset detail:', dataset.value)

  if (dataset.value?.versioncount) {
    versionTabs.value = Array.from(
      { length: dataset.value.versioncount },
      (_, index) => index + 1,
    )
    console.log('Generated version tabs:', versionTabs.value)
  }

  loadVersionData(datasetId, 1)
}

const loadVersionData = async (datasetId: number, versionId: number) => {
  versionData.value = null
  const data = await fetchVersionData(datasetId, versionId)
  console.log('Data received from API:', data)
  if (data) {
    versionData.value = data[0]
  }
}

const handleTabClick = (tab: any) => {
  const selectedVersionId = parseInt(tab.index) + 1
  const datasetId = Number(route.params.id)
  loadVersionData(datasetId, selectedVersionId)
}

onMounted(async () => {
  await openFullScreen1()
  loadDatasetDetail()
})

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const expertTagsArray = computed(() => {
  return dataset.value.tags
    ? dataset.value.tags.split(',').map(tag => tag.trim())
    : []
})
</script>

<style scoped lang="scss">
.dataset-detail {
  &__container {
    padding: 20px 40px;
  }

  &__heading {
    display: flex;
    justify-content: space-between;
  }

  &__image {
    width: 400px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }

  &__version-container {
    min-height: 300px;
    margin-top: 40px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
  }
}

.version-desc {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 15px;
}

.version-content {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;

  &__right {
    margin-left: 70px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 15px;

    &--actions {
      display: flex;
      margin-top: 220px;
    }
  }

  &__left {
    border-right: 1px solid #ccc;
    padding-right: 120px;
    padding-left: 100px;

    &--directory {
      margin-top: 50px;
      font-size: 17px;
      font-weight: 600;
      border: 1px solid #ccc;
      padding: 20px 20px 20px 10px;
      border-radius: 10px;
    }
  }
}

.expert-tag {
  height: 35px;
  font-size: 14px;
}
</style>
