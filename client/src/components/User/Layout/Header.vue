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
        <el-dropdown>
          <!--          <el-avatar-->
          <!--            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"-->
          <!--          />-->

          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="32"
              height="32"
              rx="16"
              fill="#FF4500"
              fill-opacity="0.780392"
            />
            <path
              d="M21 23V21.3333C21 20.4493 20.691 19.6014 20.1408 18.9763C19.5907 18.3512 18.8446 18 18.0667 18H12.9333C12.1554 18 11.4093 18.3512 10.8592 18.9763C10.309 19.6014 10 20.4493 10 21.3333V23"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 15C17.6569 15 19 13.6569 19 12C19 10.3431 17.6569 9 16 9C14.3431 9 13 10.3431 13 12C13 13.6569 14.3431 15 16 15Z"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span class="el-dropdown-link">
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Your profile</el-dropdown-item>
              <router-link to="/your-work" class="page-link">
                <el-dropdown-item> Your work</el-dropdown-item>
              </router-link>
              <el-dropdown-item>Transaction History</el-dropdown-item>
              <el-dropdown-item>Settings</el-dropdown-item>
              <!--              <el-dropdown-item disabled>Action 4</el-dropdown-item>-->
              <!--              <el-dropdown-item divided>Action 5</el-dropdown-item>-->
              <el-dropdown-item divided @click="logout"
                >Log out
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
import { ArrowDown } from '@element-plus/icons-vue'
import { logout as logoutService } from '@/services/auth'
import { useRouter } from 'vue-router'

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

const logout = async () => {
  try {
    await logoutService()
    localStorage.removeItem('access_token')
    isLoggedIn.value = false
    await route.push('/auth/login')
  } catch (error) {
    console.error('Failed to logout:', error)
  }
}
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

<style lang="scss">
.el-dropdown-menu__item:nth-of-type(4):not(.is-disabled):hover {
  background-color: #ffd9d9;
  color: red;
}

.el-dropdown-menu__item:not(.is-disabled) {
  font-size: 15px;
  height: 40px;
  width: 180px;
}
</style>
