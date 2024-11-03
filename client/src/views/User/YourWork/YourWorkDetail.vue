<template>
  <div class="your-work-detail__container">
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

    <!--    Hard code-->
    <div class="your-work-detail__option">
      <!--          1-->
      <div class="card" @click="dialogVisible = true">
        <img src="/your-work-sending.png" alt="Card image" class="card-image" />
        <div class="card-content" style="background-color: #e3e3e3">
          <h2 class="card-title">Sending</h2>
          <p class="card-info">Compelete ✅</p>
          <p class="card-info">Number of participants: 35</p>
          <p class="card-info">Uploaded: 350 MB</p>
          <p class="card-footer">
            <button class="btn btn--rounded">Upload more images</button>
          </p>
        </div>
      </div>

      <!--          2-->
      <router-link to="/labeling">
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
            <p class="card-info">Number of participants: 35</p>
            <p class="card-info">Labeled: 123/234</p>
            <p class="card-footer">
              <button class="btn btn--rounded">Continue</button>
            </p>
          </div>
        </div>
      </router-link>
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
    cursor: pointer;
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
