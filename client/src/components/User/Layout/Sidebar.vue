<template>
  <div :class="['sidebar-container', { collapsed: isCollapsed }]">
    <div class="sidebar-head">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="collapse-btn"
        @click="$emit('toggleSidebar')"
      >
        <path
          fill="#ff914d"
          d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
        />
      </svg>
      <router-link to="/">
        <img src="@/assets/img/logo-text.png" alt="" class="logo-img" />
      </router-link>
    </div>

    <div class="sidebar-list">
      <template v-for="(item, index) in items" :key="index">
        <router-link
          v-if="item.action === 'navigate'"
          :to="item.to"
          class="sidebar-items"
          @click="handleActiveClick(index)"
          active-class="active"
          ref="sidebarLinks"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="item.viewBox"
            class="sidebar-icon"
          >
            <path :fill="item.fillColor" :d="item.path" />
          </svg>
          <span>{{ item.label }}</span>
        </router-link>

        <!-- Handle New Dataset -->
        <div
          v-else-if="item.action === 'expand'"
          class="sidebar-items"
          @click="toggleDatasetOptions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="item.viewBox"
            class="sidebar-icon"
          >
            <path :fill="item.fillColor" :d="item.path" />
          </svg>
          <span>{{ item.label }}</span>
        </div>
        <!-- Options for New Dataset -->
        <div
          v-if="isDatasetExpanded && item.action === 'expand'"
          class="dataset-option__container"
        >
          <div class="dataset-option" @click="openModal('selling')">
            Selling Request
          </div>
          <div class="dataset-option" @click="openModal('buying')">
            Buying Request
          </div>
        </div>
      </template>
    </div>

    <RequestSendingModal
      v-model:visible="centerDialogVisible"
      :title="modalTitle"
      :modalType="modalType"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import RequestSendingModal from '@/components/User/Modal/RequestSendingModal.vue'

const sidebarLinks = ref<HTMLElement[]>([])
const isDatasetExpanded = ref(false)
const centerDialogVisible = ref(false)
const modalTitle = ref('')
const modalType = ref('')

const openModal = type => {
  modalType.value = type
  modalTitle.value =
    type === 'selling' ? 'Send Selling Request' : 'Send Buying Request'
  centerDialogVisible.value = true
}

const props = defineProps({
  isCollapsed: Boolean,
})

const items = [
  {
    to: '/',
    label: 'Home',
    viewBox: '0 0 576 512',
    fillColor: '#ef5350',
    path: 'M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
    action: 'navigate',
  },
  {
    to: '/datasets',
    label: 'Datasets',
    viewBox: '0 0 448 512',
    fillColor: '#66bb6a',
    path: 'M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z',
    action: 'navigate',
  },
  {
    to: '/new-dataset',
    label: 'New Dataset',
    viewBox: '0 0 512 512',
    fillColor: '#fbc02d',
    path: 'M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z',
    action: 'expand',
  },
  {
    to: '/project',
    label: 'Project',
    viewBox: '0 0 576 512',
    fillColor: '#2877d2',
    path: 'M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 16 192 0 0-16c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-16-192 0 0 16c0 1.7-.1 3.4-.3 5L272 288l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-1.7 .1-3.4 .3-5L144 224l-96 0c-26.5 0-48-21.5-48-48L0 80z',
    action: 'navigate',
  },
  {
    to: '/report',
    label: 'Report',
    viewBox: '0 0 448 512',
    fillColor: '#ec407a',
    path: 'M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32L0 64 0 368 0 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30l0-247.7c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48l0-16z',
    action: 'navigate',
  },
  {
    to: '/help',
    label: 'Help',
    viewBox: '0 0 640 512',
    fillColor: '#b197fc',
    path: 'M544 248l0 3.3 69.7-69.7c21.9-21.9 21.9-57.3 0-79.2L535.6 24.4c-21.9-21.9-57.3-21.9-79.2 0L416.3 64.5c-2.7-.3-5.5-.5-8.3-.5L296 64c-37.1 0-67.6 28-71.6 64l-.4 0 0 120c0 22.1 17.9 40 40 40s40-17.9 40-40l0-72c0 0 0-.1 0-.1l0-15.9 16 0 136 0c0 0 0 0 .1 0l7.9 0c44.2 0 80 35.8 80 80l0 8zM336 192l0 56c0 39.8-32.2 72-72 72s-72-32.2-72-72l0-118.6c-35.9 6.2-65.8 32.3-76 68.2L99.5 255.2 26.3 328.4c-21.9 21.9-21.9 57.3 0 79.2l78.1 78.1c21.9 21.9 57.3 21.9 79.2 0l37.7-37.7c.9 0 1.8 .1 2.7 .1l160 0c26.5 0 48-21.5 48-48c0-5.6-1-11-2.7-16l2.7 0c26.5 0 48-21.5 48-48c0-12.8-5-24.4-13.2-33c25.7-5 45.1-27.6 45.2-54.8l0-.4c-.1-30.8-25.1-55.8-56-55.8c0 0 0 0 0 0l-120 0z',
    action: 'navigate',
  },
]

const handleActiveClick = (index: number) => {
  sidebarLinks.value.forEach((link, i) => {
    const element = link instanceof HTMLElement ? link : link?.$el
    if (i === index) {
      const svgPath = link.querySelector('path')
      const fillColor = svgPath?.getAttribute('fill') || '#000'
      link.style.borderLeft = `3px solid ${fillColor}`
    } else {
      link.style.borderLeft = 'none'
    }
  })
}

const handleSubmit = formData => {
  console.log('Form submitted:', formData)
}

const toggleDatasetOptions = () => {
  isDatasetExpanded.value = !isDatasetExpanded.value
}

onMounted(() => {
  sidebarLinks.value = Array.from(document.querySelectorAll('.sidebar-items'))
})
</script>

<style scoped lang="scss">
.sidebar-head {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0 15px 25px;
}

.collapse-btn {
  width: 20px;
  cursor: pointer;

  .sidebar-container.collapsed & {
    margin-top: 9px;
  }
}

.logo-img {
  margin-left: 10px;
  width: 125px;
  object-fit: cover;
  display: flex;
  align-items: center;

  .sidebar-container.collapsed & {
    display: none;
  }
}

.sidebar-container {
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 70px;
  }
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  .sidebar-container.collapsed & {
    margin-top: 30px;
  }

  span {
    text-decoration: underline #1b2430;
    color: #fff;

    .sidebar-container.collapsed & {
      display: none;
    }
  }
}

.sidebar-items {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 25px;
  width: 100%;
  height: 65px;
  padding: 0 10px 0 40px;
  color: #ddd;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  transition:
    background 0.3s ease,
    padding 0.4s ease,
    border-radius 0.3s ease,
    margin-left 0.4s ease;

  &:hover {
    padding: 0 45px;
    font-size: 17px;
    font-weight: 500;
    background-color: #121b25;

    .sidebar-icon {
      width: 20px;
    }
  }

  &.active {
    padding: 0 45px;
    font-size: 18px;
    font-weight: 500;
    background-color: #121b25;

    .sidebar-icon {
      width: 20px;
    }
  }

  .sidebar-container.collapsed & {
    padding: 10px;
    justify-content: center;
    transition: margin-left 0.4s ease;
  }
}

.sidebar-icon {
  width: 17px;
}

.dataset-option__container {
  margin-left: 40px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dataset-option {
  color: #ccc;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    color: #fff;
    font-weight: 600;
  }
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}
</style>
<style lang="scss">
.el-dialog__header {
  margin: 20px 0;
}

.el-dialog__title {
  font-weight: 600;
  font-size: 22px;
}

//.el-dialog {
//  min-height: 80vh;
//  margin-top: 80px;
//}
//
//
.el-dialog {
  z-index: 2000;
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
