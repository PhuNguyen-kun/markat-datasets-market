<template>
  <div class="common-layout">
    <el-container>
      <el-aside :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
        <Sidebar :isCollapsed="isCollapsed" @toggleSidebar="toggleSidebar" />
      </el-aside>
      <el-container>
        <el-header class="header">
          <Header />
        </el-header>
        <div class="content">
          <el-main
            :class="['main', { 'main-collapsed': isCollapsed }]"
            style="background-color: #f8f8f8; padding: 0"
          >
            <RouterView></RouterView>
          </el-main>
          <el-footer class="footer">
            <Footer />
          </el-footer>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/User/Layout/Header.vue'
import Footer from '@/components/User/Layout/Footer.vue'
import Sidebar from '@/components/User/Layout/Sidebar.vue'
import { ref } from 'vue'

const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>
<style scoped lang="scss">
.common-layout {
  min-height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 245px;
  background-color: #1b2430;
  height: 100vh;
  transition: width 0.4s ease;
}

.sidebar-collapsed {
  width: 70px;
}

.header {
  height: 60px;
  border-bottom: 2px solid #ccc;
  //position: fixed;
  background-color: #fff;
  width: 100%;
}

.content {
  overflow: auto;
  height: calc(100vh - 60px);
  //display: flex;
  //flex-direction: column;
}

.main {
  //margin-top: 60px;
  //flex: 1.8;
}

.footer {
  //height: 170px;
  min-height: calc(100vh - 500px);
  background-color: var(--markat-theme-dark);
  background-image: url('/background_in_space.webp');
  //background-repeat: no-repeat, repeat;
}
</style>

<style lang="scss">
.el-footer {
}
</style>
