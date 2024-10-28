<template>
  <div class="header-container">
    <div class="search-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="search-icon"
      >
        <path
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        />
      </svg>
      <form action="">
        <input
          type="text"
          name=""
          id=""
          placeholder="Search for data"
          required=""
        />
      </form>
    </div>

    <div class="header-action">
      <template v-if="isLoggedIn">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </template>
      <template v-else>
        <RouterLink to="/login" class="filter-btn">Sign in</RouterLink>
        <RouterLink to="/login" class="btn btn--primary-round">
          Sign up
        </RouterLink>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
// const userAvatarUrl = ref('')

onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (token) {
    isLoggedIn.value = true

    // userAvatarUrl.value =
    //   localStorage.getItem('user_avatar') || 'default-avatar-url'
  }
})
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  justify-content: space-between;
}

.search-container {
  width: 500px;
  display: flex;
  align-items: center;
  height: 60px;
  gap: 10px;
}

.search-icon {
  width: 17px;
}

form input {
  border: none;
  font-weight: 500;
  font-size: 16px;
  outline: none;
  width: 400px;
}

input::placeholder {
  color: var(--markat-theme-dark);
  font-family: inherit;
  font-size: 16px;
}

.header-action {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
