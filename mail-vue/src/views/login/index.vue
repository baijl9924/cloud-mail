<template>
  <main id="login-box" v-loading="oauthLoading" :element-loading-text="$t('signingIn')">
    <div v-if="settingStore.settings.background" class="login-background" :style="background" aria-hidden="true"></div>

    <section class="brand-panel" aria-labelledby="mission-title">
      <div class="brand-identity">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none"><path d="M5 8c4-1 8 0 11 3 3-3 7-4 11-3v17c-4-1-8 0-11 2-3-2-7-3-11-2V8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 11v16M9 13l4 2m-4 3 4 2m6-5 4-2m-4 7 4-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m13 5 3-2 3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="brand-name">{{ settingStore.settings.title || $t('edu.brandName') }}</span>
      </div>

      <div class="brand-story">
        <p class="brand-eyebrow"><span></span>{{ $t('edu.loginEyebrow') }}</p>
        <h1 id="mission-title">{{ $t('edu.loginHeadline') }}<br><em>{{ $t('edu.loginHeadlineAccent') }}</em></h1>
        <p class="brand-description">{{ $t('edu.loginStory') }}</p>
        <EducationArt class="brand-art" />
        <ul class="brand-values">
          <li><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 4c3-1 5 0 7 2 2-2 4-3 7-2v11c-3-1-5 0-7 2-2-2-4-3-7-2V4Zm7 2v11" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>{{ $t('edu.learnTogether') }}</li>
          <li><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 16 4 10C-1 5 6-1 10 5c4-6 11 0 6 5l-6 6Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>{{ $t('edu.connectKindness') }}</li>
          <li><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 17V9m0 3C4 12 2 8 3 4c5 0 7 3 7 8Zm0-3c0-5 3-7 7-7 0 5-2 7-7 7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>{{ $t('edu.growTogether') }}</li>
        </ul>
      </div>
      <p class="brand-foot">{{ $t('edu.loginFootnote') }}</p>
    </section>

    <section class="form-panel" :aria-labelledby="show === 'login' ? 'login-title' : 'register-title'">
      <el-dropdown class="login-language" @command="lang => settingStore.lang = lang" trigger="click">
        <button type="button" :aria-label="$t('edu.language')">{{ { es: 'Español', en: 'English', zh: '简体中文' }[settingStore.lang] }}<Icon icon="lucide:chevron-down" width="15" height="15"/></button>
        <template #dropdown><el-dropdown-menu><el-dropdown-item command="es">Español</el-dropdown-item><el-dropdown-item command="en">English</el-dropdown-item><el-dropdown-item command="zh">简体中文</el-dropdown-item></el-dropdown-menu></template>
      </el-dropdown>
      <div class="form-container">
        <div class="form-emblem" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="m4 8 8 6a3 3 0 0 0 4 0l8-6M4 20l6-5m14 5-6-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="form-heading" v-if="show === 'login'">
          <h2 id="login-title">{{ $t('edu.welcomeBack') }}</h2>
          <p>{{ $t('edu.loginIntro') }}</p>
        </div>
        <div class="form-heading" v-else>
          <h2 id="register-title">{{ $t('edu.registerTitle') }}</h2>
          <p>{{ $t('edu.registerIntro') }}</p>
        </div>

        <form v-show="show === 'login'" class="auth-form" @submit.prevent="submit">
          <div class="field-group">
            <label for="login-email">{{ $t('emailAccount') }}</label>
            <el-input id="login-email" v-model="form.email" type="text" :placeholder="$t('emailAccount')" autocomplete="username" :spellcheck="false" autocapitalize="off" :class="{ 'email-input': !hideLoginDomain }">
              <template #prefix><Icon icon="lucide:mail" width="18" height="18" /></template>
              <template #append v-if="!hideLoginDomain">
                <el-select v-if="show === 'login'" v-model="suffix" :aria-label="$t('edu.emailDomain')" :placeholder="$t('select')" class="domain-select">
                  <el-option v-for="item in domainList" :key="item" :label="item" :value="item" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="field-group">
            <label for="login-password">{{ $t('password') }}</label>
            <el-input id="login-password" v-model="form.password" :placeholder="$t('password')" type="password" autocomplete="current-password" show-password>
              <template #prefix><Icon icon="lucide:lock-keyhole" width="18" height="18" /></template>
            </el-input>
          </div>
          <el-button class="submit-button" type="primary" native-type="submit" :loading="loginLoading">
            {{ $t('edu.enterMailbox') }}<svg v-if="!loginLoading" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </el-button>
        </form>

        <form v-show="show !== 'login'" class="auth-form" @submit.prevent="submitRegister">
          <div class="field-group">
            <label for="register-email">{{ $t('emailAccount') }}</label>
            <el-input id="register-email" v-model="registerForm.email" type="text" :placeholder="$t('emailAccount')" autocomplete="username" :spellcheck="false" autocapitalize="off" :class="{ 'email-input': !hideLoginDomain }">
              <template #prefix><Icon icon="lucide:mail" width="18" height="18" /></template>
              <template #append v-if="!hideLoginDomain">
                <el-select v-if="show !== 'login'" v-model="suffix" :aria-label="$t('edu.emailDomain')" :placeholder="$t('select')" class="domain-select">
                  <el-option v-for="item in domainList" :key="item" :label="item" :value="item" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="field-group">
            <label for="register-password">{{ $t('password') }}</label>
            <el-input id="register-password" v-model="registerForm.password" :placeholder="$t('password')" type="password" autocomplete="new-password" show-password>
              <template #prefix><Icon icon="lucide:lock-keyhole" width="18" height="18" /></template>
            </el-input>
          </div>
          <div class="field-group">
            <label for="register-password-confirm">{{ $t('confirmPwd') }}</label>
            <el-input id="register-password-confirm" v-model="registerForm.confirmPassword" :placeholder="$t('confirmPwd')" type="password" autocomplete="new-password" show-password>
              <template #prefix><Icon icon="lucide:lock-keyhole" width="18" height="18" /></template>
            </el-input>
          </div>
          <div class="field-group" v-if="settingStore.settings.regKey === 0 || settingStore.settings.regKey === 2">
            <label for="register-code">{{ $t(settingStore.settings.regKey === 0 ? 'regKey' : 'regKeyOptional') }}</label>
            <el-input id="register-code" v-model="registerForm.code" :placeholder="$t(settingStore.settings.regKey === 0 ? 'regKey' : 'regKeyOptional')" type="text" autocomplete="off" />
          </div>
          <div v-show="verifyShow" class="register-turnstile" :data-sitekey="settingStore.settings.siteKey" data-callback="onTurnstileSuccess" data-error-callback="onTurnstileError" data-after-interactive-callback="loadAfter" data-before-interactive-callback="loadBefore">
            <span class="verify-error" v-if="botJsError" role="alert">{{ $t('verifyModuleFailed') }}</span>
          </div>
          <el-button class="submit-button" type="primary" native-type="submit" :loading="registerLoading">
            {{ $t('edu.createMailbox') }}<svg v-if="!registerLoading" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </el-button>
        </form>

        <div v-if="oauthProviders.length" class="oauth-section">
          <div class="oauth-divider"><span>{{ $t('edu.continueWith') }}</span></div>
          <div class="oauth-options">
            <el-button v-for="p in oauthProviders" :key="p.key" class="oauth-button" @click="oauthLogin(p.key)">
              <el-avatar v-if="p.iconType === 'image'" :src="p.icon" :size="18" />
              <Icon v-else :icon="p.icon" width="18" height="18" />
              <span>{{ p.label }}</span>
            </el-button>
          </div>
        </div>

        <div class="form-switch" v-if="settingStore.settings.register === 0">
          <template v-if="show === 'login'">{{ $t('noAccount') }}<button type="button" @click="show = 'register'">{{ $t('regSwitch') }}<span aria-hidden="true">↗</span></button></template>
          <template v-else>{{ $t('hasAccount') }}<button type="button" @click="show = 'login'">{{ $t('loginSwitch') }}<span aria-hidden="true">↗</span></button></template>
        </div>
        <p class="community-note"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14V7m0 3C3 10 2 7 3 3c4 0 5 3 5 7Zm0-3c0-4 2-5 5-5 0 4-2 5-5 5Z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>{{ $t('edu.communityNote') }}</p>
      </div>
    </section>

    <el-dialog class="bind-dialog" v-model="showBindForm" :title="$t('edu.bindMailbox')" width="440px">
      <p class="bind-description">{{ $t('edu.bindIntro') }}</p>
      <form class="auth-form bind-container" @submit.prevent="bind">
        <div class="field-group">
          <label for="bind-email">{{ $t('emailAccount') }}</label>
          <el-input id="bind-email" v-model="bindForm.email" type="text" :placeholder="$t('emailAccount')" autocomplete="username" :spellcheck="false" autocapitalize="off" :class="{ 'email-input': !hideLoginDomain }">
            <template #append v-if="!hideLoginDomain">
              <el-select v-model="suffix" :aria-label="$t('edu.emailDomain')" :placeholder="$t('select')" class="domain-select">
                <el-option v-for="item in domainList" :key="item" :label="item" :value="item" />
              </el-select>
            </template>
          </el-input>
        </div>
        <div class="field-group" v-if="settingStore.settings.regKey === 0 || settingStore.settings.regKey === 2">
          <label for="bind-code">{{ $t(settingStore.settings.regKey === 0 ? 'regKey' : 'regKeyOptional') }}</label>
          <el-input id="bind-code" v-model="bindForm.code" :placeholder="$t(settingStore.settings.regKey === 0 ? 'regKey' : 'regKeyOptional')" type="text" autocomplete="off" />
        </div>
        <el-button class="submit-button" type="primary" native-type="submit" :loading="bindLoading">{{ $t('edu.bindAction') }}</el-button>
      </form>
    </el-dialog>
  </main>
</template>

<script setup>
import router from "@/router";
import {useRoute} from "vue-router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {websiteConfig} from "@/request/setting.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import EducationArt from "@/components/education-art/index.vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin, oauthGithubLogin, oauthGoogleLogin} from "@/request/ouath.js";

const {t} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const route = useRoute();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')

const oauthKeys = ['linuxdo', 'github', 'google']

const oauthProvider = computed(() => {
  const fromState = route.query.state
  if (oauthKeys.includes(fromState)) return fromState
  const fromStore = sessionStorage.getItem('oauthProvider')
  return oauthKeys.includes(fromStore) ? fromStore : null
})

const oauthProviders = computed(() => {
  const allProviders = [
    { key: 'google', label: 'Google', icon: 'devicon:google', iconType: 'iconify' },
    { key: 'github', label: 'GitHub', icon: 'codicon:github-inverted', iconType: 'iconify' },
    { key: 'linuxdo', label: 'LinuxDo', icon: '/image/linuxdo.webp', iconType: 'image' },
  ]
  return allProviders.filter(p => settingStore.settings[p.key + 'Switch'] === 0)
})

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',

});
const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  console.warn('人机验加载失败', e)
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  console.log('loadAfter')
}

window.loadBefore = (e) => {
  console.log('loadBefore')
}

const loginOpacity = computed(() => {
  const opacity = settingStore.settings.background ? (settingStore.settings.loginOpacity ?? 1) : 1
  return uiStore.dark ? `rgba(29, 39, 34, ${opacity})` : `rgba(255, 254, 250, ${opacity})`
})

const hideLoginDomain = computed(() => settingStore.settings.loginDomain === 1)

const background = computed(() => {

  return settingStore.settings.background ? {
    'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center'
  } : ''
})

const getFullEmail = (email) => {
  return hideLoginDomain.value ? email : email + suffix.value
}

const getEmailName = (email) => {
  return email.split('@')[0]
}

function oauthLogin(provider) {
  const clientId = settingStore.settings[provider + 'ClientId']
  const redirectUri = encodeURIComponent(window.location.origin + '/login')
  sessionStorage.setItem('oauthProvider', provider)
  const authorizeUrls = {
    linuxdo: `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email&state=${provider}`,
    github: `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${provider}`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email&state=${provider}`,
  }
  window.location.href = authorizeUrls[provider]
}

const loginFns = {
  linuxdo: oauthLinuxDoLogin,
  github: oauthGithubLogin,
  google: oauthGoogleLogin,
}

oauthGetUser();

async function oauthGetUser() {

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code || !oauthProvider.value) return

  const provider = oauthProvider.value
  oauthLoading.value = true
  sessionStorage.removeItem('oauthProvider')
  window.history.replaceState({}, '', window.location.origin + window.location.pathname)

  loginFns[provider](code, window.location.origin + '/login').then(data => {

    bindForm.oauthUserId = data.userInfo.oauthUserId;

    if (!data.token) {
      showBindForm.value = true
      oauthLoading.value = false
      ElMessage({
        message: t('edu.bindIntro'),
        type: 'warning',
        duration: 4000,
        plain: true,
      })
      return;
    }

    saveToken(data.token);
  }).catch(() => {
    oauthLoading.value = false
  })
}

function bind() {

  if (bindLoading.value) return

  if (!bindForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }


  if (getEmailName(bindForm.email).length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = getFullEmail(bindForm.email);


  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!bindForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  const form = {email, oauthUserId: bindForm.oauthUserId, code: bindForm.code}

  bindLoading.value = true
  oauthBindUser(form).then(data => {
    saveToken(data.token)
  }).catch(() => {
    bindLoading.value = false
  })
}

const submit = () => {

  if (loginLoading.value) return

  if (!form.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = getFullEmail(form.email);

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  loginLoading.value = true
  login(email, form.password).then(async data => {
    await saveToken(data.token)
  }).finally(() => {
    loginLoading.value = false
  })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  refreshWebsiteConfig()
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({name: 'layout'})
  uiStore.showNotice()
  oauthLoading.value = false;
  bindLoading.value = false;
}

function refreshWebsiteConfig() {
  websiteConfig().then(setting => {
    settingStore.settings = setting
    settingStore.domainList = setting.domainList
    if (!suffix.value && setting.domainList.length > 0) {
      suffix.value = setting.domainList[0]
    }
    document.title = setting.title
  }).catch(e => {
    console.error(e)
  })
}


function submitRegister() {

  if (registerLoading.value) return

  if (!registerForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  console.log(registerForm.email)

  if (getEmailName(registerForm.email).length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  const email = getFullEmail(registerForm.email);

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!registerForm.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {

    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!registerForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            console.log('人机验证js加载失败')
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg'),
        type: "error",
        plain: true
      })
    }
    return;
  }

  registerLoading.value = true

  const form = {
    email,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }

  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({
      message: t('regSuccessMsg'),
      type: 'success',
      plain: true,
    })
  }).catch(res => {

    registerLoading.value = false

    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true

    }
  });
}

</script>

<style lang="scss" scoped>
#login-box {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.13fr) minmax(0, 1fr);
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--edu-ink, #283d32);
  background: var(--edu-paper, #f6f5ef);
  isolation: isolate;
}

.login-background {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.brand-panel {
  padding: 40px clamp(38px, 5.6vw, 90px) 25px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: color-mix(in srgb, var(--edu-paper, #f6f5ef) 94%, transparent);
  overflow: hidden;
}

.brand-identity {
  display: flex;
  align-items: center;
  gap: 13px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 13px 13px 13px 3px;
  color: #fffdf5;
  background: var(--edu-green, #244b3c);
  flex-shrink: 0;
  svg { width: 30px; height: 30px; }
}

.brand-name {
  font-size: 23px;
  font-family: var(--font-family-serif, Georgia, 'Noto Serif SC', serif);
  font-weight: 600;
  letter-spacing: -.5px;
  overflow-wrap: anywhere;
}

.brand-story {
  width: 100%;
  max-width: 560px;
  margin: auto;
  padding-top: 50px;
  animation: arrive .65s ease-out both;
}

.brand-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 24px;
  color: var(--edu-muted, #718073);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.8px;
  line-height: 1.7;
  text-transform: uppercase;
  span { height: 1px; width: 26px; background: var(--edu-accent, #c39b53); flex-shrink: 0; }
}

.brand-story h1 {
  margin: 0;
  font-family: var(--font-family-serif, Georgia, 'Noto Serif SC', serif);
  font-size: clamp(35px, 3.65vw, 57px);
  font-weight: 500;
  letter-spacing: -1.8px;
  line-height: 1.22;
  em { font-weight: 400; color: var(--edu-green, #244b3c); }
}

.brand-description {
  margin: 23px 0 0;
  max-width: 425px;
  color: var(--edu-muted, #718073);
  font-size: 13px;
  line-height: 1.95;
}

.brand-art {
  width: min(110%, 580px);
  max-width: none;
  margin: 0 0 -6px -5%;
  animation: arrive .85s .1s ease-out both;
}

.brand-values {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin: 0;
  padding: 22px 0 0;
  border-top: 1px solid var(--edu-border, #dedfd3);
  color: var(--edu-muted, #718073);
  font-size: 11px;
  line-height: 1.6;
  li { display: flex; align-items: center; gap: 7px; }
  svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--edu-green, #244b3c); }
}

.brand-foot {
  margin: 45px 0 0;
  font-size: 10px;
  letter-spacing: .2px;
  color: var(--edu-muted, #718073);
  opacity: .8;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 60px clamp(30px, 4.5vw, 80px);
  border-left: 1px solid var(--edu-border, #dedfd3);
  background: v-bind(loginOpacity);
}

.form-container {
  width: 100%;
  max-width: 382px;
  animation: arrive .7s .12s ease-out both;
}

.form-emblem {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 26px;
  color: var(--edu-green, #244b3c);
  border: 1px solid var(--edu-border, #dedfd3);
  border-radius: 50%;
  background: var(--edu-paper, #f6f5ef);
  svg { width: 26px; height: 26px; }
}

.form-heading {
  margin-bottom: 34px;
  h2 {
    margin: 0 0 10px;
    font-family: var(--font-family-serif, Georgia, 'Noto Serif SC', serif);
    font-size: 33px;
    font-weight: 500;
    letter-spacing: -.8px;
    line-height: 1.3;
  }
  p { margin: 0; font-size: 13px; color: var(--edu-muted, #718073); line-height: 1.7; }
}

.auth-form { display: grid; gap: 21px; }
.field-group {
  min-width: 0;
  label { display: block; margin-bottom: 9px; font-size: 12px; font-weight: 600; line-height: 1.5; }
  .el-input { width: 100%; height: 49px; }
  :deep(.el-input__wrapper) {
    padding: 0 15px;
    border-radius: 8px;
    background: var(--edu-surface, #fffefa);
    box-shadow: 0 0 0 1px var(--edu-border, #dedfd3) inset;
    transition: box-shadow .2s;
  }
  :deep(.el-input__wrapper.is-focus) { box-shadow: 0 0 0 1px var(--edu-green, #244b3c) inset, 0 0 0 3px color-mix(in srgb, var(--edu-green, #244b3c) 9%, transparent); }
  :deep(.el-input__inner) { color: var(--edu-ink, #283d32); font-size: 13px; }
  :deep(.el-input__prefix-inner) { color: var(--edu-muted, #718073); margin-right: 3px; }
  :deep(.el-input-group__append) {
    padding: 0;
    box-shadow: 0 0 0 1px var(--edu-border, #dedfd3) inset;
    background: var(--edu-paper, #f6f5ef);
    border-radius: 0 8px 8px 0;
    overflow: hidden;
  }
  .email-input :deep(.el-input__wrapper) { border-radius: 8px 0 0 8px; }
  .domain-select {
    width: 145px;
    margin: 0;
    :deep(.el-select__wrapper) { height: 49px; padding: 0 10px; border-radius: 0; background: transparent; box-shadow: none; }
    :deep(.el-select__selected-item) { font-size: 11px; color: var(--edu-ink, #283d32); }
    :deep(.el-select__wrapper.is-focused) { box-shadow: 0 0 0 1px var(--edu-green, #244b3c) inset; }
  }
}

.submit-button {
  width: 100%;
  height: 49px;
  margin-top: 4px;
  border-radius: 8px;
  background: var(--c-brand-600, #244b3c);
  border-color: var(--c-brand-600, #244b3c);
  color: #fffdf5;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .15px;
  transition: background .2s, transform .2s;
  &:hover, &:focus-visible { background: var(--c-brand-800); border-color: var(--c-brand-800); color: #fffdf5; }
  &:active { transform: translateY(1px); }
  :deep(> span) { display: flex; align-items: center; justify-content: center; gap: 14px; }
  svg { width: 18px; height: 18px; }
}

.oauth-section { margin-top: 27px; }
.oauth-divider {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 18px;
  color: var(--edu-muted, #718073);
  font-size: 10px;
  &::before, &::after { content: ''; height: 1px; flex: 1; background: var(--edu-border, #dedfd3); }
}
.oauth-options { display: flex; flex-wrap: wrap; gap: 9px; }
.oauth-button {
  margin: 0 !important;
  flex: 1;
  min-width: 98px;
  height: 44px;
  padding: 0 10px;
  border-radius: 8px;
  border-color: var(--edu-border, #dedfd3);
  background: var(--edu-surface, #fffefa);
  color: var(--edu-ink, #283d32);
  :deep(> span) { display: flex; gap: 8px; align-items: center; font-size: 12px; }
  &:hover, &:focus-visible { border-color: var(--edu-green, #244b3c); background: var(--edu-paper, #f6f5ef); color: var(--edu-green, #244b3c); }
}

.form-switch {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 5px;
  margin-top: 27px;
  color: var(--edu-muted, #718073);
  font-size: 12px;
  line-height: 1.7;
  button {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 3px 4px;
    border: 0;
    border-radius: 3px;
    background: transparent;
    font: inherit;
    font-weight: 600;
    color: var(--edu-green, #244b3c);
    cursor: pointer;
    &:hover { text-decoration: underline; text-underline-offset: 3px; }
    &:focus-visible { outline: 2px solid var(--edu-green, #244b3c); outline-offset: 3px; }
  }
}

.community-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin: 39px 0 0;
  padding-top: 24px;
  border-top: 1px solid var(--edu-border, #dedfd3);
  font-size: 10px;
  line-height: 1.7;
  color: var(--edu-muted, #718073);
  text-align: center;
  svg { width: 16px; height: 16px; flex-shrink: 0; }
}

.register-turnstile { max-width: 100%; }
.verify-error { font-size: 12px; color: var(--el-color-danger); }
.bind-description { margin: 0 0 22px; font-size: 13px; color: var(--edu-muted, #718073); line-height: 1.7; }
:deep(.bind-dialog) { max-width: calc(100vw - 32px); border-radius: 16px; padding: 26px; background: var(--edu-surface, #fffefa); }
.bind-container { margin-bottom: 4px; }

@keyframes arrive { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

@media (min-width: 1600px) { .brand-story { max-width: 620px; } .brand-art { width: 105%; margin-left: -3%; } }
@media (max-width: 1100px) {
  .brand-panel { padding: 32px 35px 24px; }
  .brand-story { padding-top: 38px; }
  .brand-story h1 { font-size: 39px; }
  .brand-description { font-size: 12px; }
  .brand-values { gap: 12px; font-size: 10px; li { flex-direction: column; align-items: flex-start; gap: 6px; } }
  .form-panel { padding: 44px 35px; }
}
@media (max-width: 760px) {
  #login-box { grid-template-columns: minmax(0, 1fr); }
  .brand-panel { padding: 25px 25px 21px; }
  .brand-mark { width: 35px; height: 35px; border-radius: 11px 11px 11px 3px; svg { width: 25px; height: 25px; } }
  .brand-name { font-size: 21px; }
  .brand-story { max-width: 430px; margin: 27px auto 0; padding: 0; }
  .brand-eyebrow { font-size: 9px; margin-bottom: 13px; letter-spacing: 1.2px; }
  .brand-story h1 { font-size: clamp(31px, 7vw, 42px); line-height: 1.18; letter-spacing: -1px; }
  .brand-description, .brand-art, .brand-values, .brand-foot { display: none; }
  .form-panel { border-left: 0; border-top: 1px solid var(--edu-border, #dedfd3); padding: 32px 25px 36px; }
  .form-container { max-width: 430px; }
  .form-emblem { display: none; }
  .form-heading { margin-bottom: 25px; h2 { font-size: 29px; } }
  .auth-form { gap: 18px; }
  .community-note { margin-top: 30px; }
}
@media (max-width: 380px) {
  .brand-panel { padding-inline: 20px; }
  .form-panel { padding-inline: 20px; }
  .field-group .domain-select { width: 126px; }
  .field-group :deep(.el-input__wrapper) { padding-inline: 10px; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
.login-language { position: absolute; top: 28px; right: 32px; }
.login-language button { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--edu-muted); cursor: pointer; padding: 8px; }
@media (max-width: 767px) { .login-language { top: 18px; right: 14px; } }
</style>
