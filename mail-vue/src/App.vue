<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { computed, watch } from "vue";
import {useSettingStore} from "@/store/setting.js";
const settingStore = useSettingStore()
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import esLocale from 'element-plus/es/locale/lang/es';
import('@/icons/index.js')
const { locale } = useI18n()
if (!['zh', 'en', 'es'].includes(settingStore.lang)) {
  settingStore.lang = 'es'
}
locale.value = settingStore.lang
watch(() => settingStore.lang, () => locale.value = settingStore.lang)
const elLocale = computed(() => settingStore.lang === 'zh' ? zhCn : (settingStore.lang === 'es' ? esLocale : null))
</script>
