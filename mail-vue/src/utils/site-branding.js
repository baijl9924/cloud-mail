export const DEFAULT_SITE_NAME = 'Charity Education'

// Older installations can still have the previous brand in saved site settings.
function replaceLegacyBrand(value, replacement = DEFAULT_SITE_NAME) {
  return typeof value === 'string'
    ? value.replace(/\bcloud[\s_-]*mail\b/gi, () => replacement)
    : value
}

function normalizeNoticeHtml(html, siteName) {
  if (!html) return html

  // Change presentation text without altering links, image URLs or HTML markup.
  const template = document.createElement('template')
  template.innerHTML = html
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.parentElement?.closest('script, style')) {
      node.textContent = replaceLegacyBrand(node.textContent, siteName)
    }
  }
  for (const element of template.content.querySelectorAll('[title], [alt], [aria-label]')) {
    for (const attribute of ['title', 'alt', 'aria-label']) {
      if (element.hasAttribute(attribute)) {
        element.setAttribute(attribute, replaceLegacyBrand(element.getAttribute(attribute), siteName))
      }
    }
  }
  return template.innerHTML
}

export function normalizeSiteBranding(settings, fallbackName = DEFAULT_SITE_NAME) {
  const title = replaceLegacyBrand(settings.title || fallbackName)
  return {
    ...settings,
    title,
    noticeTitle: replaceLegacyBrand(settings.noticeTitle, title),
    noticeContent: normalizeNoticeHtml(settings.noticeContent, title),
  }
}
