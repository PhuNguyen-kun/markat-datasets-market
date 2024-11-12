<template>
  <div class="labeling-detail__container">
    <button class="btn btn--rounded page-link" @click="goBack">
      <el-icon size="20">
        <Back />
      </el-icon>
      <span>Back</span>
    </button>
    <div class="heading">
      <div class="heading--title">
        <h1 class="small-title">Flowers Dataset</h1>
        <h2 class="small-sub-title">Version 1</h2>
      </div>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        class="labeling-detail-pagination"
      />
    </div>

    <div class="labeling-detail__main">
      <img
        src="/608f74bc-c3ee-41ea-929a-b7259578e6e4.jpg"
        alt=""
        class="main-left"
      />
      <div class="main-right">
        <div class="label-detail__tag">
          <button class="btn btn--rounded">Animals</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.labeling-detail__container {
  padding: 20px;
}

.labeling-detail-pagination {
  width: 100%;
  margin-left: 280px;
}

.labeling-detail__container {
  .heading {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: start;

    &--title {
      width: 250px;
      display: flex;
      align-items: start;
      flex-direction: column;
      gap: 15px;
      margin-left: 30px;
    }

    .small-title {
      font-size: 20px;
      font-weight: 600;
    }

    &--img {
      width: 200px;
      height: auto;
    }
  }
}

.labeling-detail__main {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  max-height: calc(100vh - 280px);

  .main-left {
    min-width: 900px;
    border: 1px solid #999;
    border-radius: 10px;
    padding: 20px;
    object-fit: contain;
  }

  .main-right {
    width: 400px;
    border: 1px solid #999;
    border-radius: 10px;
    padding: 20px;
  }
}
</style>
