<template>
  <div class="homepage__container">
    <div class="homepage__right">
      <h1 class="homepage__title">
        The best market for you to find
        <span
          style="color: var(--markat-theme-orange); text-decoration: underline"
          >DATA
        </span>
      </h1>
      <div style="min-height: 100px">
        <p class="homepage__desc" ref="typedElement"></p>
      </div>
      <div
        ref="lottieContainer1"
        class="lottie-container1"
        style="display: flex"
      ></div>
    </div>
    <div class="homepage__left">
      <div ref="lottieContainer" class="lottie-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Typed from 'typed.js'
import lottie from 'lottie-web'

const lottieContainer = ref(null)
const lottieContainer1 = ref(null)
import { ref, onMounted } from 'vue'
import { ElLoading } from 'element-plus'

const typedElement = ref(null)

onMounted(() => {
  if (typedElement.value) {
    const options = {
      strings: [
        'The easy and straightforward way to find, compare, and access data products from over 500 top data providers around the world, allowing you to make quick, accurate, and well-informed decisions, and helping you manage your data needs effectively and efficiently.',
      ],
      typeSpeed: 0,
      backSpeed: 25,
      backDelay: 2000,
      loop: false,
      showCursor: false,
    }
    new Typed(typedElement.value, options)
  }
  if (lottieContainer.value) {
    lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://lottie.host/d1ca1bb4-7917-4183-8663-b844cfc1c42a/kLBNHZe027.json',
    })
  }
  if (lottieContainer1.value) {
    lottie.loadAnimation({
      container: lottieContainer1.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://lottie.host/d68259fd-a6ca-4243-8eb5-03c1b0fda94a/uGCQhJgYnX.json',
    })
  }
  if (lottieContainer1.value) {
    lottie.loadAnimation({
      container: lottieContainer1.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://lottie.host/2e95299f-6a98-4138-8349-c1173b966dc6/4jXR0EeRzy.json',
    })
  }
})
</script>

<style scoped lang="scss">
.homepage {
  &__container {
    padding: 20px;
    display: flex;
    //height: 60vh;
    //align-items: center;
    margin-bottom: 40px;
  }

  &__right {
    flex: 0.8;
    justify-content: center;
    align-items: center;

    .lottie-container1 {
      width: 550px;
      margin-top: 5px;
    }
  }

  &__left {
    flex: 1;

    .lottie-container {
      height: 500px;
      margin-left: 50px;
    }
  }

  &__title {
    font-size: 45px;
    font-weight: 700;
    margin-bottom: 30px;
    color: var(--markat-theme-dark);
  }

  &__desc {
    border-left: 8px solid #ccc;
    border-radius: 3px;
    padding-left: 10px;
    max-height: 100px;
  }
}
</style>
