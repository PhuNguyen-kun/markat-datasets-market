<template>
  <div class="common__title-black--container your-work-page">
    <h1 class="common__title-black">Your Work</h1>
    <button class="btn btn--black" style="margin-top: 30px">Add Expert</button>
  </div>

  <div class="your-work-page__container">
    <el-table
      :data="yourWorkData"
      class="your-work-table"
      header-row-class-name="table-title"
    >
      <el-table-column
        fixed
        prop="dataset_name"
        label="Dataset name"
        width="350"
      />
      <el-table-column prop="id_dataset" label="ID" width="120" />
      <!--    <el-table-column prop="id_version" label="Version ID" width="120" />-->
      <el-table-column
        prop="participation_type"
        label="Participation"
        width="230"
      />
      <el-table-column prop="create_date" label="Created date" width="330" />
      <!--    <el-table-column-->
      <!--      prop="data_sending_time_duration"-->
      <!--      label="Data "-->
      <!--      width="120"-->
      <!--    />-->
      <!--    <el-table-column prop="labeling_time_duration" label="Zip" width="120" />-->
      <!--    <el-table-column prop="valuation_time_duration" label="Zip" width="120" />-->
      <el-table-column prop="version_number" label="Version" width="160" />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default>
          <el-button link type="primary" @click="handleClick">
            Detail
          </el-button>
          <el-button link type="primary">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { notifyError } from '@/services/notification'
// import yourWorkService from '@/services/yourWork'

import { fetchYourWorkData } from '@/services/yourWork'

const handleClick = () => {
  console.log('click')
}

const yourWorkData = ref<any[]>([])

const loadData = async () => {
  try {
    const response = await fetchYourWorkData(1) // Gọi API và truyền id_user là 1
    yourWorkData.value = response.items
  } catch (error) {
    notifyError('Cannot get your work data!')
    console.error('Failed to load your work data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.your-work-page__container {
  padding: 20px;
}

.your-work-table {
}
</style>

<style lang="scss">
.el-table__header {
  font-size: 19px;
  color: #000;
  font-weight: 600;
  height: 70px;
}

.table-title {
  color: #000;
}

.el-table__body {
  min-height: 300px;
  font-size: 15px;
  font-weight: 600;
}

.el-table {
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
