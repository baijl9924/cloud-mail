<template>
  <div class="box">
    <div class="header-actions">
      <button type="button" class="edu-icon-button" @click="handleBack" :aria-label="$t('inbox')" :title="$t('inbox')"><Icon icon="lucide:arrow-left" width="20" height="20"/></button>
      <span class="reader-label">{{ $t('edu.readingLetter') }}</span>
      <button type="button" v-perm="'email:delete'" class="edu-icon-button" @click="handleDelete" :aria-label="$t('delete')" :title="$t('delete')"><Icon icon="lucide:trash-2" width="18" height="18"/></button>
      <button type="button" class="edu-icon-button" :class="{'is-starred': email.isStar}" v-if="emailStore.contentData.showStar" :aria-pressed="!!email.isStar" @click="changeStar" :aria-label="$t('starred')"><Icon icon="lucide:star" width="19" height="19"/></button>
      <button type="button" class="edu-icon-button" v-if="emailStore.contentData.showReply" v-perm="'email:send'" @click="openReply" :aria-label="$t('reply')" :title="$t('reply')"><Icon icon="lucide:reply" width="20" height="20"/></button>
      <button type="button" class="edu-icon-button" v-if="emailStore.contentData.showReply" v-perm="'email:send'" @click="openForward" :aria-label="$t('forward')" :title="$t('forward')"><Icon icon="lucide:arrow-up-right" width="20" height="20"/></button>
    </div>
    <div></div>
    <el-scrollbar class="scrollbar">
      <div class="container">
        <div class="email-title">
          {{ email.subject || $t('noSubject') }}
        </div>
        <div class="content">
          <div class="email-info">
            <div>
              <div class="send"><span class="send-source">{{$t('from')}}</span>
                <div class="send-name">
                  <span class="send-name-title">{{ email.name }}</span>
                  <span><{{ email.sendEmail }}></span>
                </div>
              </div>
              <div class="receive"><span class="source">{{$t('recipient')}}</span><span class="receive-email">{{  formateReceive(email.recipient) }}</span></div>
              <div class="date">
                <div>{{ formatDetailDate(email.createTime) }}</div>
              </div>
            </div>
            <el-alert v-if="email.status === 3" :closable="false" :title="toMessage(email.message)" class="email-msg" type="error" show-icon />
            <el-alert v-if="email.status === 4" :closable="false" :title="$t('complained')" class="email-msg" type="warning" show-icon />
            <el-alert v-if="email.status === 5" :closable="false" :title="$t('delayed')" class="email-msg" type="warning" show-icon />
          </div>
          <el-scrollbar class="htm-scrollbar" :class="!email.attList?.length ? 'bottom-distance' : ''">
            <ShadowHtml class="shadow-html" :html="formatImage(email.content)" v-if="email.content" />
            <pre v-else class="email-text" >{{email.text}}</pre>
          </el-scrollbar>
          <div class="att" v-if="email.attList?.length > 0">
            <div class="att-title">
              <span>{{$t('attachments')}}</span>
              <span>{{$t('attCount',{total: email.attList.length})}}</span>
            </div>
            <div class="att-box">

              <div class="att-item" v-for="att in email.attList" :key="att.attId">
                <div class="att-icon" @click="showImage(att.key)">
                  <Icon v-bind="getIconByName(att.filename)" />
                </div>
                <div class="att-name" @click="showImage(att.key)">
                  {{ att.filename }}
                </div>
                <div class="att-size">{{ formatBytes(att.size) }}</div>
                <div class="opt-icon att-icon">
                  <Icon v-if="isImage(att.filename)" icon="lucide:eye" width="22" height="22" @click="showImage(att.key)"/>
                  <a :href="cvtR2Url(att.key)" download>
                    <Icon icon="lucide:download" width="22" height="22"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="reply-actions" v-if="emailStore.contentData.showReply" v-perm="'email:send'">
          <el-button @click="openReply" type="primary" plain><Icon icon="lucide:reply" width="17" height="17"/>{{ $t('reply') }}</el-button>
          <el-button @click="openForward"><Icon icon="lucide:arrow-up-right" width="17" height="17"/>{{ $t('forward') }}</el-button>
        </div>
      </div>
    </el-scrollbar>
    <el-image-viewer
        v-if="showPreview"
        :url-list="srcList"
        show-progress
        @close="showPreview = false"
    />
  </div>
</template>
<script setup>
import ShadowHtml from '@/components/shadow-html/index.vue'
import {computed, reactive, ref, watch, onMounted, onUnmounted} from "vue";
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {emailDelete, emailRead} from "@/request/email.js";
import {Icon} from "@iconify/vue";
import {useEmailStore} from "@/store/email.js";
import {useAccountStore} from "@/store/account.js";
import {formatDetailDate} from "@/utils/day.js";
import {starAdd, starCancel} from "@/request/star.js";
import {getExtName, formatBytes} from "@/utils/file-utils.js";
import {cvtR2Url,toOssDomain} from "@/utils/convert.js";
import {getIconByName} from "@/utils/icon-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {allEmailDelete} from "@/request/all-email.js";
import {useUiStore} from "@/store/ui.js";
import {useI18n} from "vue-i18n";
import {EmailUnreadEnum} from "@/enums/email-enum.js";

const uiStore = useUiStore();
const settingStore = useSettingStore();
const accountStore = useAccountStore();
const emailStore = useEmailStore();
const router = useRouter()
const email = computed(() => emailStore.contentData.email || {
  emailId: 0,
  attList: [],
  content: '',
  text: '',
  recipient: '[]',
})
const showPreview = ref(false)
const srcList = reactive([])

const { t } = useI18n()
watch(() => accountStore.currentAccountId, () => {
  handleBack()
})

let readRequesting = false

function tryMarkRead() {
  if (!emailStore.contentData.showUnread || readRequesting) return
  const current = email.value
  if (!current?.emailId || current.unread !== EmailUnreadEnum.UNREAD) return

  // 等详情数据就绪（detailMap 已写入，或正文已有内容）再标已读
  const full = emailStore.detailMap[current.emailId]
  const detailReady = !!full || !!(current.content || current.text)
  if (!detailReady) return

  readRequesting = true
  const emailId = current.emailId
  current.unread = EmailUnreadEnum.READ
  if (emailStore.detailMap[emailId]) {
    emailStore.detailMap[emailId].unread = EmailUnreadEnum.READ
  }
  emailStore.markListRead(emailId)
  emailRead([emailId]).finally(() => {
    readRequesting = false
  })
}

watch(
  () => [
    email.value?.emailId,
    email.value?.content,
    email.value?.text,
    emailStore.detailMap[email.value?.emailId]
  ],
  () => tryMarkRead(),
  { flush: 'post' }
)

onMounted(() => {
  tryMarkRead()
  window.addEventListener('keydown', handleKeyDown);
})

onUnmounted(() => {
  emailStore.contentData.showUnread = false;
  readRequesting = false
  window.removeEventListener('keydown', handleKeyDown);
})

function handleKeyDown(event) {
  if (event.key !== 'Escape') return;
  if (showPreview.value) return;
  if (document.querySelector('.el-message-box')) return;
  const writeBox = document.querySelector('.write-box');
  if (writeBox && writeBox.offsetParent !== null) return;
  handleBack();
}

function openReply() {
  uiStore.writerRef.openReply(email.value)
}

function openForward() {
  uiStore.writerRef.openForward(email.value)
}

function toMessage(message) {
  return  message ? JSON.parse(message).message : '';
}

function formatImage(content) {
  content = content || '';
  const domain = settingStore.settings.r2Domain;
  return  content.replace(/{{domain}}/g, toOssDomain(domain) + '/');
}

function showImage(key) {
  if (!isImage(key)) return;
  const url = cvtR2Url(key)
  srcList.length = 0
  srcList.push(url)
  showPreview.value = true
}

function isImage(filename) {
  return ['png', 'jpg', 'jpeg', 'bmp', 'gif','jfif'].includes(getExtName(filename))
}

function formateReceive(recipient) {
  if (!recipient) return ''
  recipient = JSON.parse(recipient)
  return recipient.map(item => item.address).join(', ')
}

function changeStar() {
  if (email.value.isStar) {
    email.value.isStar = 0;
    starCancel(email.value.emailId).then(() => {
      email.value.isStar = 0;
      emailStore.cancelStarEmailId = email.value.emailId
      setTimeout(() => emailStore.cancelStarEmailId = 0)
      emailStore.starScroll?.deleteEmail([email.value.emailId])
    }).catch((e) => {
      console.error(e)
      email.value.isStar = 1;
    })
  } else {
    email.value.isStar = 1;
    starAdd(email.value.emailId).then(() => {
      email.value.isStar = 1;
      emailStore.addStarEmailId = email.value.emailId
      setTimeout(() => emailStore.addStarEmailId = 0)
      emailStore.starScroll?.addItem(email.value)
    }).catch((e) => {
      console.error(e)
      email.value.isStar = 0;
    })
  }
}

const handleBack = () => {
  router.back()
}

const handleDelete = () => {
  ElMessageBox.confirm(t('delEmailConfirm'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(() => {
    if (emailStore.contentData.delType === 'logic') {
      emailDelete(email.value.emailId).then(() => {
        ElMessage({
          message: t('delSuccessMsg'),
          type: 'success',
          plain: true,
        })
        emailStore.deleteIds = [email.value.emailId]
      })
    } else  {

      allEmailDelete(email.value.emailId).then(() => {
        ElMessage({
          message: t('delSuccessMsg'),
          type: 'success',
          plain: true,
        })
        emailStore.deleteIds = [email.value.emailId]
      })
    }

    router.back()
  })
}
</script>
<style scoped lang="scss">
.box {
  height: 100%;
  overflow: hidden;
}

.header-actions {
  padding: 10px 20px 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--header-actions-border);
  font-size: 18px;
  .star {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 21px;
  }
  .icon {
    cursor: pointer;
    width: 34px;
    height: 34px;
    padding: 7px;
    box-sizing: border-box;
    border-radius: 50%;
    color: var(--el-text-color-secondary);
    transition: background .15s ease, color .15s ease;
    &:hover {
      background: var(--c-bg-hover);
      color: var(--el-color-primary);
    }
  }
}


.scrollbar {
  height: calc(100% - 54px);
  width: 100%;
}

.container {
  max-width: 1040px;
  margin: 0 auto;
  font-size: 14px;
  padding: 26px 30px 8px;
  @media (max-width: 1023px) {
    padding: 16px 18px 6px;
  }

  .email-title {
    font-family: var(--font-family-serif);
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.1px;
    color: var(--el-text-color-primary);
    margin-bottom: 6px;
    padding-bottom: 16px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 46px;
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--edu-accent, #be9551), transparent);
    }
    @media (max-width: 1023px) {
      font-size: 20px;
      padding-bottom: 12px;
    }
  }

  .htm-scrollbar {
  }

  .content {
    display: flex;
    flex-direction: column;

    .att {
      margin-top: 30px;
      margin-bottom: 30px;
      border: 1px solid var(--light-border-color);
      padding: 16px;
      border-radius: var(--radius-md, 12px);
      background: var(--el-fill-color-extra-light);
      width: fit-content;
      .att-box {
        min-width: min(410px,calc(100vw - 60px));
        max-width: 600px;
        display: grid;
        gap: 10px;
        grid-template-rows: 1fr;
      }

      .att-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        span:first-child {
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
        span:last-child {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
      }

      .att-item {
        cursor: pointer;
        div {
          align-self: center;
        }
        background: var(--el-bg-color);
        border: 1px solid var(--light-border-color);
        padding: 8px 12px;
        border-radius: 8px;
        align-self: start;
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 4px;
        transition: border-color .15s ease, box-shadow .15s ease;
        &:hover {
          border-color: var(--el-color-primary-light-5);
          box-shadow: 0 1px 4px rgba(24, 53, 44, 0.08);
        }
        .att-icon {
          display: grid;
        }

        .att-size {
          color: var(--secondary-text-color);
        }

        .att-name {
          margin-left: 8px;
          margin-right: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }

        .att-image {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .opt-icon {
          padding-left: 10px;
          color: var(--secondary-text-color);
          align-items: center;
          display: flex;
          gap: 8px;
          cursor: pointer;
          a {
            color: var(--secondary-text-color);
            align-items: center;
            display: flex;
          }
        }
      }
    }

    .email-info {
      margin: 18px 0 22px;
      padding: 16px 18px 12px;
      border-radius: var(--radius-md, 12px);
      border: 1px solid var(--light-border-color);
      background: var(--el-fill-color-extra-light);
      @media (max-width: 1024px) {
        margin: 14px 0 16px;
        padding: 13px 14px 8px;
      }
      .date {
        color: var(--regular-text-color);
        margin-bottom: 6px;
        font-size: 13px;
      }

      .email-msg {
        max-width: 400px;
        width: fit-content;
        margin-bottom: 15px;
      }

      .send {
        display: flex;
        margin-bottom: 6px;

        .send-name {
          color: var(--regular-text-color);
          display: flex;
          flex-wrap: wrap;
        }

        .send-name-title {
          padding-right: 5px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
      }

      .receive {
        margin-bottom: 6px;
        display: flex;
        .receive-email {
          max-width: 700px;
          word-break: break-word;
        }
        span:nth-child(2) {
          color: var(--regular-text-color);
        }
      }

      .send-source {
        white-space: nowrap;
        font-weight: bold;
        padding-right: 10px;
      }

      .source {
        white-space: nowrap;
        font-weight: bold;
        padding-right: 10px;
      }
    }
  }
}

.shadow-html::after  {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--message-block-color); /* 半透明黑色蒙层 */
  pointer-events: none; /* 不影响点击 */
}

.email-text {
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.bottom-distance {
  margin-bottom: 30px;
}


.reader-label { margin-right: auto; font-size: 10px; letter-spacing: 1.5px; color: var(--edu-muted); }
.header-actions { min-height: 54px; padding: 9px 20px; gap: 6px; background: var(--el-fill-color-extra-light); }
.reply-actions { display: flex; gap: 8px; padding: 8px 0 36px; }
.reply-actions :deep(.el-button) { padding: 17px 20px; }
.reply-actions svg { margin-right: 8px; }
.container .email-title { overflow-wrap: anywhere; }
.container .content .email-info .send-name { overflow-wrap: anywhere; min-width: 0; }
.container .content .att { max-width: 100%; }
.container .content .att .att-box { min-width: 0; width: 100%; }
@media (max-width: 767px) { .header-actions { padding: 9px 12px; gap: 2px; } .reader-label { font-size: 9px; letter-spacing: .5px; } }
</style>
