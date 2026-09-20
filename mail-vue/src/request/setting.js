import http from '@/axios/index.js';
import {normalizeSiteBranding} from '@/utils/site-branding.js';

export function settingSet(setting) {
    return http.put('/setting/set', setting)
}

export function settingQuery() {
    return http.get('/setting/query').then(settings => normalizeSiteBranding(settings))
}

export function websiteConfig() {
    return http.get('/setting/websiteConfig').then(settings => normalizeSiteBranding(settings))
}

export function setBackground(background) {
    return http.put('/setting/setBackground',{background})
}

export function deleteBackground() {
    return http.delete('/setting/deleteBackground')
}

export function setBlackList(params) {
    return http.put('/setting/setBlacklist', params)
}
