<template>
  <div class="labeling__container">
    <div class="heading">
      <div class="heading--title">
        <img src="/avatar1.png" alt="" class="heading--img" />
        <h1 class="small-title">Demographic Data Analysis</h1>
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
    <h1 class="labeling__title">Labeling Workspace</h1>
    <div class="labeling__main">
      <!--        1-->
      <div class="card" @click="dialogVisible = true">
        <div class="card-content">
          <h2 class="card-title">Part 1</h2>
          <p class="card-info">Labeled: 123/234</p>
          <p class="card-info">Participants: 31</p>
          <p class="card-footer">
            <button class="btn btn--rounded">Start labeling</button>
          </p>
        </div>
      </div>

      <!--        2-->
      <div class="card" @click="dialogVisible = true">
        <div class="card-content" style="background-color: #e3e3e3">
          <div style="display: flex; align-items: center; gap: 15px">
            <h2 class="card-title">Part 2</h2>
            <div class="flex gap-2">
              <el-tag type="success">Finished</el-tag>
            </div>
          </div>
          <p class="card-info">Labeled: 234/234</p>
          <p class="card-info">Participants: 50</p>
          <p class="card-footer">
            <button class="btn btn--rounded">Start labeling</button>
          </p>
        </div>
      </div>

      <!--        3-->
      <div class="card" @click="dialogVisible = true">
        <div class="card-content">
          <h2 class="card-title">Part 3</h2>
          <p class="card-info">Labeled: 240/586</p>
          <p class="card-info">Participants: 68</p>
          <p class="card-footer">
            <button class="btn btn--rounded">Start labeling</button>
          </p>
        </div>
      </div>

      <!--        4-->
      <div class="card" @click="dialogVisible = true">
        <div class="card-content">
          <h2 class="card-title">Part 4</h2>
          <p class="card-info">Labeled: 250/586</p>
          <p class="card-info">Participants:79</p>
          <p class="card-footer">
            <button class="btn btn--rounded">Start labeling</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { Calendar } from '@element-plus/icons-vue'

const value = ref(Date.now() + 1000 * 60 * 60 * 7)
const value1 = ref(Date.now() + 1000 * 60 * 60 * 24 * 2)
const value2 = ref(dayjs().add(1, 'month').startOf('month'))

function reset() {
  value1.value = Date.now() + 1000 * 60 * 60 * 24 * 2
}
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
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;

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
