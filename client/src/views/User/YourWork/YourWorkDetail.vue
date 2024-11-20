<template>
  <div class="your-work-detail__container">
    <div @click="goBack" class="page-link">
      <button class="btn btn--rounded">
        <el-icon size="20">
          <Back />
        </el-icon>
        <span>Back</span>
      </button>
    </div>
    <div class="heading">
      <div class="heading--title">
        <div style="display: flex; flex-direction: column; width: 300px">
          <h1 class="small-title">{{ datasetName }}</h1>
          <h2 class="small-sub-title">Version {{ versionNumber }}</h2>
        </div>
        <img src="/flowers_dataset_thumbnail.png" alt="" class="heading--img" />
      </div>
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

    <!--    Hard code-->
    <div class="your-work-detail__option">
      <!--          1-->
      <div class="card" @click="dialogVisible = true">
        <img src="/your-work-sending.png" alt="Card image" class="card-image" />
        <div class="card-content" style="background-color: #e3e3e3">
          <h2 class="card-title">Sending</h2>
          <p class="card-info">User sent count: {{ userSentCount }}</p>
          <p class="card-info">Number of participants: {{ totalSenders }}</p>
          <p class="card-info">Uploaded: {{ totalImageSizeMB }} MB</p>
          <p class="card-footer">
            <button class="btn btn--rounded">Upload more images</button>
          </p>
        </div>
      </div>

      <!--          2-->
      <div class="card">
        <img
          src="/your-work-labeling.png"
          alt="Card image"
          class="card-image"
        />
        <div class="card-content">
          <h2 class="card-title">Labeling</h2>
          <p class="card-info">
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="50"
              striped
              striped-flow
            />
          </p>
          <p class="card-info">Number of participants: {{ totalLabelers }}</p>
          <p class="card-info">Labeled: {{ userLabeledCount }}</p>
          <p class="card-footer">
            <button class="btn btn--rounded" @click="navigateToLabeling">
              Continue
            </button>
          </p>
        </div>
      </div>
      <!--          3-->
      <div class="card">
        <img
          src="/your-work-valuation.jpg"
          alt="Card image"
          class="card-image"
        />
        <div class="card-content" style="background-color: #e3e3e3">
          <h2 class="card-title">Valuation</h2>
          <p class="card-info">
            <span>12000</span>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="50"
            />
          </p>
          <p class="card-info">
            <span>345678</span>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="70"
            />
          </p>
          <p class="card-info">
            <span>10102004</span>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              status="success"
              :percentage="100"
            />
          </p>
          <p class="card-footer">
            <button class="btn btn--rounded">Change vote</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Calendar } from '@element-plus/icons-vue'
import { fetchYourWorkData, fetchYourWorkDetailData } from '@/services/yourWork'
import { useRoute, useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { notifyError } from '@/services/notification'
import { ElLoading } from 'element-plus'

const route = useRoute()
const router = useRouter()

const id_user = Number(route.query.id_user)
const id_dataset = Number(route.query.id_dataset)
const id_version = Number(route.query.id_version)
const datasetName = ref('')
const versionNumber = ref('')
const totalSenders = ref(0)
const userSentCount = ref(0)
const totalImageSizeMB = ref(0)
const totalLabelers = ref(0)
const userLabeledCount = ref(0)

const value = ref(Date.now() + 1000 * 60 * 60 * 7)
const value1 = ref(Date.now() + 1000 * 60 * 60 * 24 * 2)
const value2 = ref(dayjs().add(1, 'month').startOf('month'))
let loadingInstance: any = null

const goBack = () => {
  router.back()
}

function reset() {
  value1.value = Date.now() + 1000 * 60 * 60 * 24 * 2
}

const loadYourWorkData = async () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Markat is loading 🗿⌛',
    background: 'rgba(0, 0, 0, 0.1)',
  })

  try {
    const data = await fetchYourWorkData(id_user)
    console.log('Fetched Data:', data)

    const items = data?.data?.versions || []
    console.log('Items:', items)

    const selectedWork = items.find((item: any) => {
      return (
        item.id_dataset === id_dataset &&
        (!id_version || item.id_version === id_version)
      )
    })

    if (selectedWork) {
      datasetName.value = selectedWork.dataset_name
      versionNumber.value = selectedWork.version_number
    } else {
      console.error(
        'No matching work found for the provided dataset and version IDs',
      )
    }
  } catch (error) {
    console.error('Failed to load your work data:', error)
  } finally {
    if (loadingInstance) {
      loadingInstance.close()
    }
  }
}

const loadYourWorkDetailData = async () => {
  try {
    const data = await fetchYourWorkDetailData(id_user, id_dataset)
    console.log('Fetched Data:', data)

    if (data?.data?.version && data.data.version.length > 0) {
      const item = data.data.version[0]

      totalSenders.value = item.totalSenders
      userSentCount.value = item.userSentCount
      totalImageSizeMB.value = parseFloat(item.totalImageSizeMB.toFixed(2))
      totalLabelers.value = item.totalLabelers
      userLabeledCount.value = item.userLabeledCount

      console.log('Total Senders:', totalSenders.value)
    } else {
      console.error('No version data found in the response')
    }
  } catch (error) {
    console.error('Failed to load your work detail data:', error)
  }
}

const navigateToLabeling = () => {
  const userId = id_user
  const versionId = id_version || 1

  if (userId && versionId) {
    router.push({
      path: '/labeling',
      query: {
        id_user: userId.toString(),
        id_version: versionId.toString(),
      },
    })
  } else {
    notifyError('Failed to navigate to labeling')
    console.error('Invalid or missing parameters')
  }
}

onMounted(() => {
  loadYourWorkData()
  loadYourWorkDetailData()
})
</script>

<style scoped lang="scss">
.your-work-detail__option {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 60px;
  margin-bottom: 30px;
}

.el-col {
  text-align: center;
}

.countdown-footer {
  margin-top: 8px;
}

.your-work-detail__container {
  padding: 20px;

  .heading--title {
    font-size: 20px;
    font-weight: 600;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 350px;
    height: 500px;
    border-radius: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition: transform 0.2s;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card-image {
    width: 100%;
    height: 160px;
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
    font-size: 19px;
    font-weight: bold;
    margin: 8px 0 30px 0;
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

.your-work-detail__container .heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 200px;
  margin-top: 30px;

  &--title {
    width: 350px;
    display: flex;
    align-items: start;
    gap: 15px;
  }

  &--img {
    width: 280px;
    height: auto;
    border-radius: 10px;
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
  width: 200px;
}

.small-sub-title {
  font-size: 16px;
  font-weight: 400;
}

.count-down {
  width: 550px;
  font-size: 20px;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
  color: #ff914d;
}

.your-work {
  &--img {
    width: 80%;
    border-radius: 10px;
    height: 150px;
    margin-bottom: 10px;
  }

  &--title {
    margin-top: 15px;
    font-size: 19px;
    font-weight: 500;
  }

  &--participant {
    margin-top: 40px;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .participant-title {
      font-weight: 500;
    }

    .participant-number {
      margin-top: 20px;
      font-size: 30px;
      font-weight: 500;
    }
  }

  &--stats {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 35px;
    font-size: 19px;

    .stats--title {
      font-weight: 500;
    }

    .stats--number {
      font-size: 17px;
    }
  }
}

.your-work-sending {
  width: 90%;
  height: 520px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 30px;
  padding: 20px 20px;
  background-color: #e0e0e0;
  box-shadow: 1px 1px 5px 1px #ccc;

  &--status {
    margin-top: 30px;
    font-size: 22px;
    font-weight: 600;
    color: rgb(0, 169, 0);
  }
}

.your-work-labeling {
  width: 90%;
  height: 520px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 30px;
  padding: 20px 20px;
  background-color: #fff;
  box-shadow: 1px 1px 5px 1px #ccc;

  .progress {
    width: 100%;
    height: 20px;
    margin-top: 30px;
    margin-bottom: 2px;
    font-size: 12px;
    border-radius: 999px;
  }
}

.your-work-valuation {
  width: 90%;
  height: 520px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 30px;
  padding: 20px 20px;
  background-color: #fff;
  box-shadow: 1px 1px 5px 1px #ccc;

  .progress {
    width: 100%;
    height: 20px;
    margin-top: 30px;
    margin-bottom: 2px;
    font-size: 12px;
    border-radius: 999px;
  }
}
</style>
