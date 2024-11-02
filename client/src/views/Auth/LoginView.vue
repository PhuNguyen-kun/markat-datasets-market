<template>
  <div class="form-login">
    <form @submit.prevent="handleSubmit" class="form-login-container" id="form">
      <div class="title">
        <router-link to="/"
          ><img src="@/assets/img/logo-text.png" alt="" class="logo-img"
        /></router-link>

        <!--        <h1 class="heading">Login to Account</h1>-->
        <p class="desc">Please enter your email and password to continue</p>
      </div>

      <!-- Email -->
      <div class="form-group">
        <div class="label">Email address</div>
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          class="form-input"
          :class="{ error: errors.email }"
          @input="validateEmail"
        />
        <div class="error-message" v-if="errors.email">
          {{ errors.email }}
        </div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <div class="label">
          <div>Password</div>
          <a href="#!" class="login-link">Forget Password?</a>
        </div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="form-input"
          :class="{ error: errors.password }"
          @input="validatePassword"
        />
        <div class="error-message" v-if="errors.password">
          {{ errors.password }}
        </div>
      </div>

      <label class="form-checkbox">
        <input type="checkbox" v-model="remember" />
        <span class="form-checkbox-label login-link">Remember Password</span>
      </label>

      <div class="btn-group">
        <button
          type="submit"
          class="signin-btn"
          @click="loginAccount"
          v-loading.fullscreen.lock="fullscreenLoading"
        >
          Sign in
        </button>
        <div class="link-to-signup">
          <p>Don't have an account?</p>
          <a href="#" style="text-decoration: underline; color: #5a8cff"
            >Create Account</a
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/services/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'

const route = useRouter()
const isLoading = ref(false)
const fullscreenLoading = ref(false)
// const openFullScreen1 = () => {
//   fullscreenLoading.value = true
//   setTimeout(() => {
//     fullscreenLoading.value = false
//     route.push('/')
//   }, 2000)
// }

const openFullScreen1 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Markat is loading 🗿⌛',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
    route.push('/')
  }, 1500)
}

const email = ref<string>('')
const password = ref<string>('')
const remember = ref<boolean>(false)
const errors = ref<{ email?: string; password?: string }>({})
const handleSubmit = () => {
  const isValid = checkValidation()

  if (isValid) {
    console.log('Successfully')
  } else {
    console.log('Failed')
  }
}
const loginAccount = async () => {
  console.log('Loading started', isLoading.value)
  try {
    const loginForm = {
      email: email.value,
      password: password.value,
    }
    const response = await login(loginForm)
    console.log(response)

    const access_token = response.data.access_token
    localStorage.setItem('access_token', access_token)
    openFullScreen1()
  } catch (error) {
    console.error('Login failed', error)
  } finally {
  }
}

const checkValidation = (): boolean => {
  let isValid = true
  errors.value = {}

  if (!isValidEmail(email.value)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }

  if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }

  return isValid
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateEmail = () => {
  if (isValidEmail(email.value)) {
    removeError('email')
  }
}

const validatePassword = () => {
  if (password.value.length >= 8) {
    removeError('password')
  }
}

const removeError = (field: 'email' | 'password') => {
  if (errors.value[field]) {
    errors.value[field] = ''
  }
}
</script>

<style scoped lang="scss">
.form-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--markat-theme-dark);
  background-image: url('/rm314-bb-18.jpg');
  background-size: cover;
}

.form-login-container {
  width: 450px;
  //height: 580px;
  background-color: #fff;
  border-radius: 18px;
  padding: 20px 40px 30px 40px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

//.heading {
//  margin-top: 10px;
//  font-size: 23px;
//  font-weight: 700;
//}

.desc {
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.form-group {
  margin-top: 20px;
}

.label {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-input {
  width: 376px;
  height: 45px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Nunito Sans', sans-serif;
  padding: 0 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #f1f4f9;
}

.form-input.error {
  border: 1px solid red;
}

input:focus {
  border: 1px solid #4880ff;
  outline: none;
}

.form-input:last-of-type {
  margin-bottom: 8px;
}

.form-input::placeholder {
  color: #ccc;
}

.login-link {
  font-size: 14px;
  font-weight: 600;
  color: #969696;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 45px;
}

.signin-btn {
  width: 300px;
  height: 40px;
  background-color: var(--markat-theme-dark);
  color: #fff;
  border-radius: 7px;
  border: none;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.link-to-signup {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  font-size: 14px;
  gap: 5px;
}

.btn:hover {
  cursor: pointer;
}

.error-message {
  font-size: 14px;
  font-weight: 500;
  color: red;
}

.logo-img {
  width: 150px;
}
</style>
