<template>
  <div class="common__title-black--container your-work-page">
    <h1 class="common__title-black">Your Work</h1>
    <button class="btn btn--black" style="margin-top: 30px">Add Expert</button>
  </div>

  <div class="your-work-page__container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTab">
      <el-tab-pane label="Overview" name="first">
        <el-table
          v-loading="loading"
          :data="yourWorkData"
          class="your-work-table"
          header-row-class-name="table-title"
        >
          <el-table-column
            fixed
            prop="dataset_name"
            label="Dataset name"
            width="270"
          />
          <el-table-column prop="id_dataset" label="ID" width="120" />
          <!--    <el-table-column prop="id_version" label="Version ID" width="120" />-->
          <el-table-column prop="version_number" label="Version" width="150" />
          <el-table-column
            prop="create_date"
            label="Created date"
            width="280"
          />
          <el-table-column
            prop="data_sending_due_date"
            label="Data sending due date"
            width="280"
          />
          <el-table-column
            prop="data_labeling_due_date"
            label="Data labeling due date"
            width="280"
          />
          <el-table-column
            prop="recently_updated"
            label="Latest updated date"
            width="280"
          />
          <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="handleClick(scope.row.id_dataset)"
              >
                Detail
              </el-button>
              <el-button link type="primary">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Your collection" name="second">
        <!--        Hard code-->
        <div class="your-collection__container">
          <!--          1-->
          <div class="card" @click="dialogVisible = true">
            <img src="/avatar1.png" alt="Card image" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">Demographic Data Analysis</h2>
              <p class="card-info">2 versions</p>
              <p class="card-info"></p>
              <p class="card-footer">1.200.000 🪙</p>
            </div>
          </div>
          <el-dialog v-model="dialogVisible" title="History" width="700">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="version" label="No." width="150" />
              <el-table-column
                prop="percentage"
                label="Percentage"
                width="160"
              />
              <el-table-column prop="kat" label="Kat coin" width="170" />
              <el-table-column prop="date" label="Date" />
            </el-table>

            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                  Confirm
                </el-button>
              </div>
            </template>
          </el-dialog>

          <!--          2-->
          <div class="card">
            <img src="/avatar2.png" alt="Card image" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">Electronics Market Research</h2>
              <p class="card-info">2 versions</p>
              <p class="card-info"></p>
              <p class="card-footer">570.049 🪙</p>
            </div>
          </div>
          <!--          3-->
          <div class="card">
            <img src="/avatar3.png" alt="Card image" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">Financial Transaction Data</h2>
              <p class="card-info">2 versions</p>
              <p class="card-info"></p>
              <p class="card-footer">1.840.670 🪙</p>
            </div>
          </div>
          <!--          4-->
          <div class="card">
            <img src="/avatar4.png" alt="Card image" class="card-image" />
            <div class="card-content">
              <h2 class="card-title">Retail Customer Feedback</h2>
              <p class="card-info">2 versions</p>
              <p class="card-info"></p>
              <p class="card-footer">370.000 🪙</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { notifyError } from '@/services/notification'
// import yourWorkService from '@/services/yourWork'
import { ElLoading, type TabsPaneContext } from 'element-plus'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()

const dialogVisible = ref(false)
import { ElMessageBox } from 'element-plus'

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const tableData = [
  {
    version: 'Version 1',
    percentage: '5%',
    kat: '+ 500 🪙',
    date: '05:30 24/7/2024',
  },
  {
    version: 'Version 5',
    percentage: '65%',
    kat: '+ 100.000 🪙',
    date: '05:31 24/10/2025',
  },
  {
    version: 'Version 7',
    percentage: '76%',
    kat: '+ 210.000 🪙',
    date: '17:30 11/7/2027',
  },
  {
    version: 'Version 9',
    percentage: '88%',
    kat: '+ 350.400 🪙',
    date: '01:17 19/5/2028',
  },
]

const activeName = ref('first')
const handleClickTab = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const loading = ref(false)

import { fetchYourWorkData } from '@/services/yourWork'

const handleClick = (id_dataset: number) => {
  console.log('click', id_dataset)

  const token = localStorage.getItem('access_token')
  if (token) {
    const decoded = jwtDecode<{ id_user: number }>(token)
    const id_user = decoded.id_user

    router.push({
      path: '/your-work-detail',
      query: { id_user: id_user.toString(), id_dataset: id_dataset.toString() },
    })
  } else {
    console.error('No access token found.')
  }
}

const yourWorkData = ref<any[]>([])

const loadData = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('access_token')
    if (token) {
      const decoded = jwtDecode<{ id_user: number }>(token)
      const id_user = decoded.id_user
      const response = await fetchYourWorkData(id_user)
      yourWorkData.value = response.data.versions
    } else {
      throw new Error('No access token found.')
    }
  } catch (error) {
    notifyError('Cannot get your work data!')
    console.error('Failed to load your work data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.your-work-page__container {
  padding: 5px 40px 60px 40px;
}

.your-work-table {
}
</style>

<style lang="scss">
.el-table__header {
  font-size: 18px;
  color: #000;
  font-weight: 600;
  height: 70px;
}

.table-title {
  color: #000;
}

.el-table__body {
  min-height: 400px;
  font-size: 15px;
  font-weight: 600;
}

.el-table {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.your-collection__container {
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: start;
}

.card {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 250px;
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
  font-size: 1.1rem;
  font-weight: bold;
  margin: 8px 0;
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
  margin-top: auto;
  padding: 10px 0;
  margin-bottom: -14px;
}
</style>

<style lang="scss">
.el-dialog {
  .el-dialog__title {
    font-weight: 600;
    font-size: 22px;
  }
}
</style>
