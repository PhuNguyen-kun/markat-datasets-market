<template>
  <div class="labeling__container">
    <button class="btn btn--rounded page-link" @click="goBack">
      <el-icon size="20">
        <Back />
      </el-icon>
      <span>Back</span>
    </button>

    <div class="heading">
      <!--      <div class="heading&#45;&#45;title">-->
      <!--        &lt;!&ndash;        <img src="/avatar1.png" alt="" class="heading&#45;&#45;img" />&ndash;&gt;-->
      <!--        &lt;!&ndash;        <h1 class="small-title">{{ datasetName }}</h1>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <h2 class="small-sub-title">Version {{ versionNumber }}</h2>&ndash;&gt;-->
      <!--      </div>-->
      <!-- Clock -->
      <p id="demo" class="count-down">
        <el-row>
          <el-col :span="8">
            <el-countdown title="Start to label" :value="value" />
          </el-col>
          <el-col :span="8">
            <el-countdown
              title="Remaining time"
              format="HH:mm:ss"
              :value="value1"
            />
            <!--            <el-button class="countdown-footer" type="primary" @click="reset">-->
            <!--              Reset-->
            <!--            </el-button>-->
          </el-col>
          <el-col :span="8">
            <el-countdown format="DD [days] HH:mm:ss" :value="value2">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  <el-icon style="margin-right: 4px" :size="12">
                    <Calendar />
                  </el-icon>
                  Still to go until next version
                </div>
              </template>
            </el-countdown>
            <div class="countdown-footer">
              {{ value2.format('YYYY-MM-DD') }}
            </div>
          </el-col>
        </el-row>
      </p>
    </div>
    <h1 class="labeling__title">Labeling Workspace</h1>
    <div class="labeling__main">
      <div class="card" v-for="item in labelingData" :key="item.id_part">
        <div class="card-content">
          <h2 class="card-title">Part {{ item.part_number }}</h2>
          <p class="card-info">Labeled: {{ item.userLabelCount }}</p>
          <p class="card-info">
            Unique Label Count: {{ item.uniqueLabelerCount }}
          </p>
          <p class="card-footer">
            <button
              class="btn btn--rounded"
              @click="moveToLabelingDetail(item.id_part)"
            >
              Start labeling
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLabelingData } from '@/services/labeling'
import dayjs from 'dayjs'
import { Calendar } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { notifyError } from '@/services/notification'
import { ElLoading } from 'element-plus'

const route = useRoute()
const router = useRouter()
const value = ref(Date.now() + 1000 * 60 * 60 * 7)
const value1 = ref(Date.now() + 1000 * 60 * 60 * 24 * 2)
const value2 = ref(dayjs().add(1, 'month').startOf('month'))
const id_version = Number(route.query.id_version)
const id_dataset = Number(route.query.id_dataset)
const id_user = Number(route.query.id_user)
const versionNumber = ref('')
const datasetName = ref('')
// const id_part = Number(route.query.id_part)
const id_part = ref<number | null>(null)

console.log(route.query)
// const id_part = ref()
// const labelingData = ref([])
let loadingInstance: any = null

type LabelingItem = {
  part_number: number
  userLabelCount: number
  id_part: number
  uniqueLabelerCount: number
}
const labelingData = ref<LabelingItem[]>([])

function goBack() {
  router.back()
}

function reset() {
  value1.value = Date.now() + 1000 * 60 * 60 * 24 * 2
}

async function loadLabelingData() {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Markat is loading 🗿⌛',
    background: 'rgba(0, 0, 0, 0.1)',
  })

  try {
    const data = await fetchLabelingData(id_user, id_version)
    console.log('API response:', data)

    labelingData.value = data.items

    if (data.id_part) {
      id_part.value = data.id_part
    } else {
      console.warn('id_part is missing in the API response')
    }
  } catch (error) {
    console.error('Failed to load labeling data:', error)
  } finally {
    if (loadingInstance) {
      loadingInstance.close()
    }
  }
}

const moveToLabelingDetail = (id_part: any) => {
  const userID = id_user || 1
  // const partID = id_part || 1
  console.log(id_user, id_part)
  if (userID && id_part) {
    router.push({
      path: '/labeling-detail',
      query: {
        id_user: userID.toString(),
        id_part: id_part.toString(),
      },
    })
  } else {
    notifyError('Failed to navigate to labeling detail')
    console.error('No labeling detail found')
  }
}

onMounted(() => {
  loadLabelingData()
})
</script>

<style scoped lang="scss">
.labeling__container {
  padding: 20px;
}

.labeling {
  &__title {
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    margin-top: 30px;
  }
}

.labeling__container .heading {
  display: flex;
  align-items: center;
  justify-content: center;

  &--title {
    width: 250px;
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: 15px;
  }

  &--img {
    width: 200px;
    height: auto;
  }
}

.your-work-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;

  .col-4:first-of-type,
  .col-4:nth-of-type(2),
  .col-4:nth-of-type(3) {
    padding-right: 0;
    padding-left: 0;
    width: 380px;
    margin-right: 10px;
  }

  .btn--white {
    margin-top: 30px;
    padding: 18px;
    width: 200px;
    position: absolute;
    bottom: 18px;
  }
}

.small-title {
  font-size: 20px;
  font-weight: 600;
}

.count-down {
  width: 950px;
  font-size: 20px;
  font-weight: 500;
  margin-top: 30px;
  margin-left: 70px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 25px;
  background-color: #dcdcdc;
  color: #ff914d;
}

.labeling__main {
  margin-top: 20px;
  margin-left: 60px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: start;

  .card {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 250px;
    height: 210px;
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
    height: 150px;
    object-fit: cover;
  }

  .card-content {
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  .card-title {
    font-size: 25px;
    font-weight: bold;
    margin: 8px 0;
  }

  .card-info {
    font-size: 16px;
    color: #555;
    margin: 4px 0;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding: 10px 0;
    margin-bottom: -14px;
  }
}
</style>
