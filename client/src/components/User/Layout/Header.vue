<template>
  <div class="header-container">
    <div class="header-action">
      <template v-if="isLoggedIn">
        <!-- Notification Bell Icon -->
        <el-dropdown>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="currentColor"
            class="notification-bell"
          >
            <path
              d="M12 2C10.34 2 9 3.34 9 5v1.29C6.73 7.76 5 10.22 5 13v5l-1 1v1h16v-1l-1-1v-5c0-2.78-1.73-5.24-4-6.71V5c0-1.66-1.34-3-3-3zm0 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"
            />
          </svg>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Notification 1</el-dropdown-item>
              <el-dropdown-item>Notification 2</el-dropdown-item>
              <el-dropdown-item>Notification 3</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown>
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
              <el-dropdown-item> {{ katAmount }} Kat </el-dropdown-item>
              <el-dropdown-item>Your profile</el-dropdown-item>
              <el-dropdown-item @click="goToYourWork"
                >Your work
              </el-dropdown-item>
              <el-dropdown-item>Transaction History</el-dropdown-item>
              <el-dropdown-item>Settings</el-dropdown-item>
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
import { isTokenExpired, logout as logoutService } from '@/services/auth'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { fetchKat } from '@/services/users'

const isLoggedIn = ref(false)
const router = useRouter()

const id_user = ref<string | null>(null)
const katAmount = ref<number>(0)

const goToYourWork = () => {
  router.push({ path: '/your-work', query: { id_user: id_user.value } })
}

onMounted(async () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    if (!isTokenExpired(token)) {
      try {
        const decoded = jwtDecode<{ id_user: string }>(token);
        id_user.value = decoded.id_user;
        isLoggedIn.value = true;
        katAmount.value = await fetchKat(Number(id_user.value));
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.warn('Token has expired');
    }
  } else {
    console.warn('No access token found in localStorage');
  }
});

const logout = async () => {
  try {
    await logoutService();
    isLoggedIn.value = false
    await router.push('login')
  } catch (error) {
    console.error('Failed to logout:', error)
  }
}
</script>

<style scoped lang="scss">
.header-container {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-action {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-bell {
  cursor: pointer;
  transition: fill 0.3s;
}

.notification-bell:hover {
  fill: #ff8c00;
}
</style>

<style lang="scss">
.el-dropdown-menu__item:not(.is-disabled) {
  font-size: 15px;
  height: 40px;
  width: 180px;
}
</style>
