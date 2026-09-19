<template>
  <el-scrollbar class="scroll">
    <div class="aside-inner">
      <button type="button" class="brand" @click="router.push({name: 'email'})">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none"><path d="M5 8c4-1 8 0 11 3 3-3 7-4 11-3v17c-4-1-8 0-11 2-3-2-7-3-11-2V8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 11v16M9 13l4 2m-4 3 4 2m6-5 4-2m-4 7 4-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m13 5 3-2 3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">{{ settingStore.settings.title }}</span>
          <span class="brand-sub">{{ $t('edu.brandCaption') }}</span>
        </span>
      </button>

      <button v-perm="'email:send'" type="button" class="compose-letter" @click="uiStore.writerRef.open()"><Icon icon="lucide:pen-line" width="20" height="20"/>{{ $t('edu.writeLetter') }}<span aria-hidden="true">+</span></button>
      <p class="folder-label">{{ $t('edu.mailFolders') }}</p>
      <el-menu :collapse="false" text-color="#fff" active-text-color="#fff">
        <el-menu-item @click="router.push({name: 'email'})" index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="lucide:mailbox" width="20" height="20" />
          <span class="menu-name">{{$t('inbox')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'send'})" index="send" v-perm="'email:send'"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="lucide:send" width="20" height="20" />
          <span class="menu-name">{{$t('sent')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'draft'})" index="draft" v-perm="'email:send'"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="lucide:file-text" width="19" height="19" />
          <span class="menu-name">{{$t('drafts')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'star'})" index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="lucide:star" width="20" height="20" />
          <span class="menu-name">{{$t('starred')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'setting'})" index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="lucide:settings" width="20" height="20" />
          <span class="menu-name">{{$t('settings')}}</span>
        </el-menu-item>
        <div class="manage-title" v-perm="['all-email:query','user:query','role:query','setting:query','analysis:query','reg-key:query']">
          <div>{{$t('manage')}}</div>
        </div>
        <el-menu-item @click="router.push({name: 'analysis'})" index="analysis" v-perm="'analysis:query'"
                      :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
          <Icon icon="lucide:chart-pie" width="24" height="24" />
          <span class="menu-name">{{$t('analytics')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'user'})" index="setting" v-perm="'user:query'"
                      :class="route.meta.name === 'user' ? 'choose-item' : ''">
          <Icon icon="lucide:user" width="20" height="20" />
          <span class="menu-name">{{$t('allUsers')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'all-email'})" index="all-email" v-perm="'all-email:query'"
                      :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
          <Icon icon="lucide:mails" width="22" height="22" />
          <span class="menu-name">{{$t('allMail')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'role'})" index="setting" v-perm="'role:query'"
                      :class="route.meta.name === 'role' ? 'choose-item' : ''">
          <Icon icon="lucide:lock" width="22" height="22" />
          <span class="menu-name">{{$t('permissions')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'reg-key'})" index="reg-key" v-perm="'reg-key:query'"
                      :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
          <Icon icon="lucide:fingerprint" width="22" height="22" />
          <span class="menu-name">{{$t('inviteCode')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'sys-setting'})" index="sys-setting" v-perm="'setting:query'"
                      :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
          <Icon icon="lucide:monitor-check" width="18" height="18" />
          <span class="menu-name">{{$t('SystemSettings')}}</span>
        </el-menu-item>
      </el-menu>

      <div class="aside-foot">
        <p class="mission">{{ $t('edu.missionAside') }}</p>
        <p class="today">{{ $t('edu.todayClassroom') }}</p>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import {Icon} from "@iconify/vue";
import {useSettingStore} from "@/store/setting.js";
import {useUiStore} from "@/store/ui.js";

const settingStore = useSettingStore();
const uiStore = useUiStore();
const route = useRoute();

</script>

<style lang="scss" scoped>

.scroll {
  --aside-width: 248px;
  width: var(--aside-width);
}

.aside-inner {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--c-sidebar-bg);
  background-image:
      radial-gradient(ellipse 90% 55% at 108% -6%, rgba(255, 253, 245, 0.08), transparent 58%),
      radial-gradient(ellipse 70% 45% at -18% 108%, rgba(225, 193, 127, 0.09), transparent 55%);
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 18px 14px 20px;
  padding: 12px 13px;
  border-radius: var(--radius-md, 12px);
  background: rgba(255, 253, 245, 0.07);
  border: 1px solid rgba(255, 253, 245, 0.09);
  cursor: pointer;
  transition: background .2s;
  &:hover { background: rgba(255, 253, 245, 0.11); }
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px 11px 11px 3px;
  color: var(--c-sidebar-accent, #e1c17f);
  background: rgba(24, 53, 44, 0.55);
  flex-shrink: 0;
  svg { width: 26px; height: 26px; }
}

.brand-text { display: flex; flex-direction: column; min-width: 0; }
.brand-name {
  font-family: var(--font-family-serif, Georgia, 'Noto Serif SC', serif);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -.3px;
  color: #fffdf5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.35;
}
.brand-sub {
  font-size: 10px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--c-sidebar-text-muted, #b8cbb8);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-menu) {
  background: transparent;
  border-right: 0;
  width: var(--aside-width);
}

:deep(.el-menu-item) {
  background: transparent;
  color: var(--c-sidebar-text, #e3ecdf);
  margin: 2px 12px !important;
  border-radius: 10px;
  height: 42px;
  padding: 0 13px !important;
  display: flex;
  align-items: center;
  position: relative;
  transition: background .18s, color .18s;

  .menu-name {
    margin-left: 15px;
    font-size: 13.5px;
    user-select: none;
    letter-spacing: .1px;
  }

  .el-icon, svg { flex-shrink: 0; color: var(--c-sidebar-text-muted, #b8cbb8); transition: color .18s; }

  &:hover {
    background: var(--c-sidebar-item-hover, rgba(255,253,245,.09)) !important;
    color: var(--c-sidebar-text-active, #fffdf5);
    .el-icon, svg { color: var(--c-sidebar-accent, #e1c17f); }
  }

  &.choose-item {
    background: var(--c-sidebar-item-active, rgba(255,253,245,.14)) !important;
    color: var(--c-sidebar-text-active, #fffdf5);
    font-weight: 600;
    box-shadow: inset 0 0 0 1px rgba(255, 253, 245, 0.10);
    .el-icon, svg { color: var(--c-sidebar-accent, #e1c17f); }
    &::before {
      content: '';
      position: absolute;
      left: -1px;
      top: 9px;
      bottom: 9px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: var(--c-sidebar-accent, #e1c17f);
    }
  }
}

.manage-title {
  margin: 16px 14px 6px;
  padding: 12px 13px 0;
  border-top: 1px solid var(--c-sidebar-divider, rgba(255,253,245,.1));
  font-size: 10.5px;
  letter-spacing: 2.2px;
  text-transform: uppercase;
  color: var(--c-sidebar-text-muted, #b8cbb8);
  opacity: .85;
}

.aside-foot {
  margin-top: auto;
  margin: auto 14px 16px;
  padding: 14px 15px;
  border-radius: var(--radius-md, 12px);
  border: 1px dashed rgba(225, 193, 127, 0.35);
  background: rgba(24, 53, 44, 0.32);

  .mission {
    margin: 0;
    font-family: var(--font-family-serif, Georgia, 'Noto Serif SC', serif);
    font-size: 12.5px;
    line-height: 1.75;
    color: var(--c-sidebar-accent, #e1c17f);
    letter-spacing: .2px;
  }

  .today {
    margin: 8px 0 0;
    font-size: 11px;
    line-height: 1.6;
    color: var(--c-sidebar-text-muted, #b8cbb8);
  }
}

:deep(.el-scrollbar__wrap--hidden-default) {
  background: var(--c-sidebar-bg) !important;
}
.brand { text-align: left; }
.compose-letter { display: flex; gap: 10px; align-items: center; margin: 0 24px 28px; padding: 14px 15px; color: #284937; background: #e9edda; border-radius: 9px; cursor: pointer; font-size: 13px; font-weight: 600; }
.compose-letter:hover { background: #f3f2e2; }
.compose-letter span { margin-left: auto; font-size: 21px; font-weight: 400; }
.folder-label { margin: 0 26px 10px; color: #b8cbb8; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
:deep(.el-scrollbar__view) { min-height: 100%; display: flex; flex-direction: column; }
.aside-inner { flex: 1; }
.aside-foot { margin-top: auto; }
:deep(.el-menu) { margin-bottom: 36px; }
</style>
