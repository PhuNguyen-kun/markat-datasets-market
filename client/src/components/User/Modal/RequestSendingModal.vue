<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="900px"
    center
    @closed="handleModalClosed"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      class="request-form"
      label-position="top"
      require-asterisk-position="right"
    >
      <!-- Form fields -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Name dataset" prop="datasetName">
            <el-input v-model="form.datasetName" placeholder="Name dataset" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Description" prop="description">
            <el-input
              v-model="form.description"
              placeholder="Description"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <template v-if="modalType === 'selling'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Data">
              <el-upload
                class="upload-demo"
                drag
                multiple
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :before-upload="beforeUpload"
                :on-change="handleFileChange"
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    Consider zipping large directories for faster uploads
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Logo">
              <el-upload
                class="upload-demo"
                drag
                multiple
                :before-upload="beforeUpload"
                :on-change="handleFileChange"
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Expected Price">
              <el-input v-model="form.expectedPrice" placeholder="Price" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Evolution">
              <el-select v-model="form.evolution" placeholder="Select">
                <el-option
                  v-for="item in evolutionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Data format">
              <el-select v-model="form.format" placeholder="Select">
                <el-option
                  v-for="item in formatOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Data Requirements" prop="requirements">
              <el-input
                v-model="form.requirements"
                placeholder="Requirements"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-else-if="modalType === 'buying'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Deposit">
              <el-input v-model="form.deposit" placeholder="Deposit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Price">
              <el-input v-model="form.price" placeholder="Price" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Due Date">
              <el-date-picker
                v-model="form.dueDate"
                placeholder="Select Date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Public">
              <el-switch v-model="form.isPublic" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <button class="btn btn--rounded" @click="onCancel" style="width: 90px">
          Cancel
        </button>
        <button
          class="btn btn--black-rounded"
          @click="onSubmit"
          style="margin-left: 10px; width: 90px"
        >
          Send
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { FormInstance } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { notifySuccess } from '@/services/notification'

const formRef = ref<FormInstance | null>(null)

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: 'Send Request' },
  modalType: { type: String, required: true },
})

const emits = defineEmits(['update:visible', 'submit'])
const dialogVisible = ref(props.visible)

const defaultForm = {
  datasetName: '',
  description: '',
  data: '',
  logo: '',
  expectedPrice: '',
  evolution: '',
  deposit: '',
  price: '',
  dueDate: null,
  isPublic: false,
  format: '',
  requirements: '',
}
const form = ref({ ...defaultForm })

const evolutionOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
]

const formatOptions = [
  { label: 'CSV', value: '1' },
  { label: 'JSON', value: '2' },
]

const rules = ref({
  datasetName: [
    { required: true, message: 'Please enter dataset name', trigger: 'blur' },
  ],
  description: [
    { required: true, message: 'Please enter description', trigger: 'blur' },
  ],
  data: [{ required: true, message: 'Please add data', trigger: 'blur' }],
  expectedPrice: [
    { required: true, message: 'Please enter expected price', trigger: 'blur' },
  ],
  evolution: [
    { required: true, message: 'Please select evolution', trigger: 'change' },
  ],
})

const handleModalClosed = () => {
  resetFormAndValidation()
  emits('update:visible', false)
}

const resetFormAndValidation = () => {
  Object.assign(form.value, defaultForm)
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

watch(
  () => props.visible,
  newVal => {
    dialogVisible.value = newVal
  },
)

watch(
  () => dialogVisible.value,
  newVal => {
    emits('update:visible', newVal)
  },
)

const onCancel = () => {
  dialogVisible.value = false
}

// const onSubmit = () => {
//   emits('submit', form.value)
//   dialogVisible.value = false
// }
const onSubmit = () => {
  formRef.value?.validate(valid => {
    if (valid) {
      console.log('Form data:', form.value)
      console.log('Uploaded files:', uploadedFiles.value)

      notifySuccess('Request submitted successfully!')

      dialogVisible.value = false

      resetFormAndValidation()
      uploadedFiles.value = []
    } else {
      ElMessage.error('Please fill in all required fields correctly.')
    }
  })
}

//Upload avatar Dataset
const uploadedFiles = ref<Array<{ name: string; url: string; raw: File }>>([])

const handleFileChange: UploadProps['onChange'] = (file, fileList) => {
  uploadedFiles.value = fileList.map(item => {
    const rawFile = item.raw as File
    return {
      name: rawFile.name,
      url: URL.createObjectURL(rawFile),
      raw: rawFile,
    }
  })

  ElMessage.success('File(s) updated successfully!')
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJpgOrPng) {
    ElMessage.error('File must be in JPG/PNG/CSV format!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('File size must be less than 2MB!')
    return false
  }
  return true
}
</script>

<style scoped lang="scss"></style>
<style lang="scss">
.upload-demo {
  width: 100%;
}

.el-form-item__label {
  font-weight: 500;
  font-size: 15px;
  margin-top: 10px;
}

.el-upload-dragger {
  border: 1px dashed #a4a4a4;
}

.el-overlay {
  .el-overlay-dialog {
    &:has(.el-dialog) {
      height: 100vh;
      overflow: auto;
    }
  }
}
</style>
